import path from 'node:path'
import fs from 'fs-extra'
import log from 'electron-log'

export const SCHEMA = 'atom'

const mimeTypes: Record<string, string> = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.html': 'text/html',
  '.htm': 'text/html',
  '.json': 'application/json',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.ico': 'image/vnd.microsoft.icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.map': 'text/plain',
}

function charset(mimeExt: string) {
  return ['.html', '.htm', '.js', '.mjs'].includes(mimeExt)
    ? 'utf-8'
    : null
}

function mime(filename: string) {
  const mimeExt = path.extname(`${filename || ''}`).toLowerCase()
  const mimeType = mimeTypes[mimeExt]
  return mimeType ? { mimeExt, mimeType } : { mimeExt: null, mimeType: null }
}

export async function protocolRequestHandler(req: any, next: any) {
  const reqUrl = new URL(req.url)
  let reqPath = decodeURIComponent(path.normalize(reqUrl.pathname))
  if (reqPath === '/') {
    reqPath = '/index.html'
  }
  const reqFilename = path.basename(reqPath)

  try {
    const buffer = await fs.readFile(reqPath)
    const { mimeExt, mimeType } = mime(reqFilename)
    if (mimeType !== null) {
      next({
        mimeType,
        charset: charset(mimeExt),
        data: buffer,
      })
    }
  }
  catch (error) {
    log.error(error)
  }
}
