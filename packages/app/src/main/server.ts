import 'cross-fetch/polyfill'
import 'reflect-metadata'
import http from 'node:http'
import { basename, extname, join } from 'node:path'
import { log } from 'electron-log'
import { createSymlink, mkdir, move, pathExists, readFile } from 'fs-extra'
import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import formidable from 'formidable'
import getPageMetadata from 'metadata-scraper'
import { kill } from 'cross-port-killer'
import type { UploadJSONFile } from '@firefly/utils'
import { getAppDataPath } from './ipcMain'
import { getCategoryAndThumb, getImageMetadata } from './utils'
import watcher from './watcher'
import { appRouter } from '~/api'
import { MESSAGE_SAVE_DIR_PATH } from '~/constants'
import type { BlockFrom, BlockMetadata } from '~/models/Block'
import { Block } from '~/entities/block'
import { DataBase } from '~main/database'

const db = new DataBase('firefly').dataSource

export const createContext = async() => {
  return { db }
}

const handler = createHTTPHandler({
  router: appRouter,
  createContext,
})

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
      const queryRunner = db.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      try {
        const from = fields.from as BlockFrom || 'pc'
        const text = fields.text as string
        const metadata = fields.metadata
          ? JSON.parse(fields.metadata as string) as unknown as BlockMetadata
          : undefined
        const jsonFiles = fields.jsonFiles
          ? JSON.parse(fields.jsonFiles as string) as unknown as UploadJSONFile[]
          : undefined
        const relativeDirPath = MESSAGE_SAVE_DIR_PATH
        const absoluteDirPath = join(getAppDataPath(), relativeDirPath)
        const isExists = await pathExists(absoluteDirPath)
        if (!isExists) {
          await mkdir(absoluteDirPath, { recursive: true })
        }

        const uploadFiles = Object.keys(files).map(v => files[v])
        for (const file of uploadFiles) {
          if (Array.isArray(file)) return
          const name = file.originalFilename!
          const relativePath = join(relativeDirPath, name)
          const absolutePath = join(absoluteDirPath, name)

          const fileExt = extname(name).split('.')[1]
          const { category, thumb } = await getCategoryAndThumb({
            ext: fileExt,
            path: relativePath,
          })
          const content = file.mimetype === 'text/plain'
            ? await readFile(file.filepath, 'utf-8')
            : undefined
          const fileName = basename(name, fileExt ? `.${fileExt}` : '')
          await move(file.filepath, absolutePath, { overwrite: true })
          const finalMetadata = metadata || (category === 'image' ? await getImageMetadata(absolutePath) : undefined)
          const old = await queryRunner.manager.findOneBy(Block, { path: relativePath })

          await queryRunner.manager.save(Block, {
            ...old,
            title: fileName,
            thumb,
            category,
            content,
            fileExt,
            path: relativePath,
            from,
            size: file.size,
            metadata: finalMetadata,
            where: 'default',
          })

          if (old) {
            await queryRunner.commitTransaction()
            res.statusCode = 200
            const statusMessage = `${fileName} updated`
            res.statusMessage = statusMessage
            return res.end(statusMessage)
          }
        }
        if (jsonFiles) {
          for (const file of jsonFiles) {
            if (Array.isArray(file)) return
            const name = file.name
            const relativePath = join(relativeDirPath, name)
            const absolutePath = join(absoluteDirPath, name)
            const fileExt = extname(name).split('.')[1]
            const { category, thumb } = await getCategoryAndThumb({
              ext: fileExt,
              path: relativePath,
            })
            const content = file.mimetype === 'text/plain'
              ? await readFile(file.filepath, 'utf-8')
              : undefined
            const fileName = basename(name, fileExt ? `.${fileExt}` : '')
            await createSymlink(file.filepath, absolutePath)
            const finalMetadata = metadata || (category === 'image' ? await getImageMetadata(file.filepath) : undefined)
            const old = await queryRunner.manager.findOneBy(Block, { path: relativePath })

            await queryRunner.manager.save(Block, {
              ...old,
              title: fileName,
              thumb,
              category,
              content,
              fileExt,
              path: relativePath,
              from,
              size: file.size,
              metadata: finalMetadata,
              where: 'default',
            })

            if (old) {
              await queryRunner.commitTransaction()
              res.statusCode = 200
              const statusMessage = `${fileName} updated`
              res.statusMessage = statusMessage
              return res.end(statusMessage)
            }
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
            const old = await queryRunner.manager.findOneBy(Block, { link })

            await queryRunner.manager.save(Block, {
              ...old,
              thumb,
              category,
              content,
              fileExt,
              from,
              link,
              size: content.length,
              metadata: finalMetadata,
              where: 'default',
            })

            if (old) {
              await queryRunner.commitTransaction()
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
            await queryRunner.manager.save(Block, {
              thumb,
              category,
              content,
              from,
              size: content.length,
              metadata: finalMetadata,
              where: 'default',
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
server.listen(PORT, () => {
  log(`Server is enabled at port ${PORT}`)

  watcher(db)
})
server.on('error', (e: any) => {
  if (e.code === 'EADDRINUSE') {
    log(e.block || 'Address in use, retrying...')
    kill(PORT)
      .then(() => {
        setTimeout(() => {
          server.close()
          server.listen(PORT)
        }, 1000)
      })
  }
})
