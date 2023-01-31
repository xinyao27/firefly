import http from 'node:http'
import { basename, extname, join } from 'node:path'
import log from 'electron-log'
import { mkdir, move, pathExists, readFile } from 'fs-extra'
import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import formidable from 'formidable'
import 'cross-fetch/polyfill'
import getPageMetadata from 'metadata-scraper'
import { Message } from '../entities/message'
import { getCategoryAndThumb, getImageMetadata } from '../utils'
import { appRouter } from './router'
import { DataBase } from './database'
import type { MessageFrom, MessageMetadata } from '~~/models/Message'
import 'reflect-metadata'

async function killPort(port: number, method = 'tcp') {
  if (!port) {
    return Promise.reject(new Error('Invalid port number provided'))
  }
  const execaCommand = (await import('execa')).execaCommand

  if (process.platform === 'win32') {
    return execaCommand('netstat -nao')
      .then((res) => {
        const { stdout } = res
        if (!stdout) return res

        const lines = stdout.split('\n')
        // The second white-space delimited column of netstat output is the local port,
        // which is the only port we care about.
        // The regex here will match only the local port column of the output
        const lineWithLocalPortRegEx = new RegExp(`^ *${method.toUpperCase()} *[^ ]*:${port}`, 'gm')
        const linesWithLocalPort = lines.filter(line => line.match(lineWithLocalPortRegEx))

        const pids = linesWithLocalPort.reduce<string[]>((acc, line) => {
          const match = line.match(/(\d*)\w*(\n|$)/gm)
          return match && match[0] && !acc.includes(match[0]) ? acc.concat(match[0]) : acc
        }, [])

        return execaCommand(`TaskKill /F /PID ${pids.join(' /PID ')}`)
      })
  }

  return execaCommand('lsof -i -P')
    .then((res) => {
      const { stdout } = res
      if (!stdout) return res
      const lines = stdout.split('\n')
      const existProccess = lines.filter(line => line.match(new RegExp(`:*${port}`))).length > 0
      if (!existProccess) return Promise.reject(new Error('No process running on port'))

      return execaCommand(`lsof -i ${method === 'udp' ? 'udp' : 'tcp'}:${port} | grep ${method === 'udp' ? 'UDP' : 'LISTEN'} | awk '{print $2}' | xargs kill -9`)
    })
}

const handler = createHTTPHandler({
  router: appRouter,
  createContext() {
    return {}
  },
})

const dataSource = new DataBase('firefly').dataSource

const validationUrl = (url: string) => {
  try {
    return Boolean(new URL(url))
  }
  catch (e) {
    return false
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method?.toLowerCase() === 'options') {
    res.statusCode = 200
    return res.end()
  }
  if (req.url === '/upload' && req.method?.toLowerCase() === 'post') {
    const form = formidable({})
    return form.parse(req, async(err, fields, files) => {
      if (err) {
        res.statusCode = err.httpCode || 400
        return res.end(String(err))
      }
      const queryRunner = dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      try {
        const from = fields.from as MessageFrom || 'pc'
        const text = fields.text as string
        const metadata = fields.metadata
          ? JSON.parse(fields.metadata as string) as unknown as MessageMetadata
          : undefined
        const relativeDirPath = '/files'
        const absoluteDirPath = join(process.env.APP_DATA_PATH!, relativeDirPath)
        const isExists = await pathExists(absoluteDirPath)
        if (!isExists) {
          await mkdir(absoluteDirPath, { recursive: true })
        }

        const uploadFiles = Object.keys(files).map(v => files[v])
        for (const file of uploadFiles) {
          if (Array.isArray(file)) return
          const name = file.originalFilename!
          const relativeFilePath = join(relativeDirPath, name)
          const absoluteFilePath = join(absoluteDirPath, name)

          const fileExt = extname(name).split('.')[1]
          const { category, thumb } = await getCategoryAndThumb({
            ext: fileExt,
            filePath: relativeFilePath,
          })
          const content = file.mimetype === 'text/plain'
            ? await readFile(file.filepath, 'utf-8')
            : undefined
          const fileName = basename(name, fileExt ? `.${fileExt}` : '')
          await move(file.filepath, absoluteFilePath, { overwrite: true })
          const finalMetadata = metadata || (category === 'image' ? await getImageMetadata(absoluteFilePath) : undefined)
          const old = await queryRunner.manager.findOneBy(Message, { filePath: relativeFilePath })

          await queryRunner.manager.save(Message, {
            ...old,
            title: fileName,
            thumb,
            category,
            content,
            fileExt,
            filePath: relativeFilePath,
            from,
            size: file.size,
            metadata: finalMetadata,
          })

          if (old) {
            res.statusCode = 200
            const statusMessage = `${fileName} updated`
            res.statusMessage = statusMessage
            return res.end(statusMessage)
          }
        }
        if (text) {
          const isUrl = validationUrl(text)
          if (isUrl) {
            const link = text
            const fileExt = 'url'
            const { category, thumb } = await getCategoryAndThumb({ ext: fileExt })
            const content = text
            const finalMetadata = metadata || await getPageMetadata(link)
            const old = await queryRunner.manager.findOneBy(Message, { link })

            await queryRunner.manager.save(Message, {
              ...old,
              thumb,
              category,
              content,
              fileExt,
              from,
              link,
              size: content.length,
              metadata: finalMetadata,
            })

            if (old) {
              res.statusCode = 200
              const statusMessage = `${(`${link} `) || ''}updated`
              res.statusMessage = statusMessage
              return res.end(statusMessage)
            }
          }
          else {
            const { category, thumb } = await getCategoryAndThumb({ ext: undefined })
            const content = text
            const finalMetadata = metadata
            await queryRunner.manager.save(Message, {
              thumb,
              category,
              content,
              from,
              size: content.length,
              metadata: finalMetadata,
            })
          }
        }
        await queryRunner.commitTransaction()
        res.statusCode = 201
        return res.end('created')
      }
      catch (err) {
        await queryRunner.rollbackTransaction()
        res.statusCode = 400
        res.statusMessage = String(err)
        return res.end(String(err))
      }
      finally {
        await queryRunner.release()
      }
    })
  }

  return handler(req, res)
})
const PORT = 5487
server.listen(PORT)
server.on('error', (e: any) => {
  if (e.code === 'EADDRINUSE') {
    log.log(e.message || 'Address in use, retrying...')
    killPort(PORT)
      .then(() => {
        setTimeout(() => {
          server.close()
          server.listen(PORT)
        }, 1000)
      })
  }
})
