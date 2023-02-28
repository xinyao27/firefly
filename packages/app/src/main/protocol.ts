import path from 'node:path'
import fs from 'fs-extra'
import log from 'electron-log'
import mime from 'mime-types'

export const SCHEMA = 'atom'

export async function protocolRequestHandler(req: any, next: any) {
  const reqUrl = (req.url as string).slice(7)
  let reqPath = decodeURIComponent(path.normalize(reqUrl))
  if (reqPath === '/')
    reqPath = '/index.html'

  const reqFilename = path.basename(reqPath)

  try {
    const buffer = await fs.readFile(reqPath)
    const mimeType = mime.lookup(reqFilename)
    if (mimeType) {
      const charset = mime.charset(mimeType)
      next({
        mimeType,
        charset,
        data: buffer,
      })
    }
  }
  catch (error) {
    log.error(error)
  }
}
