import path from 'node:path'
import { URL, pathToFileURL } from 'node:url'
import type { BrowserWindow } from 'electron'
import { app, net, protocol } from 'electron'
import { is } from '@firefly/common'

export function createAppProtocol() {
  // @ts-expect-error noop
  protocol.handle('app', (req) => {
    const { host, pathname } = new URL(req.url)
    if (host === 'renderer')
      return net.fetch(pathToFileURL(path.join(process.env.VITE_PUBLIC!, pathname)).toString())
    else if (host === 'main')
      return net.fetch(pathToFileURL(path.join(__dirname, pathname)).toString())
  })
}

export function createDefaultProtocol(win: BrowserWindow | null) {
  const scheme = 'firefly'
  const SCHEME_REGEXP = new RegExp(`^${scheme}://`)

  app.removeAsDefaultProtocolClient(scheme)
  if (is.development() && is.windows()) {
    app.setAsDefaultProtocolClient(scheme, process.execPath, [
      path.resolve(process.argv[1]),
    ])
  }
  else {
    app.setAsDefaultProtocolClient(scheme)
  }

  app.on('open-url', (_, url) => {
    const isProtocol = SCHEME_REGEXP.test(url)
    if (isProtocol)
      win?.webContents.send('schema:login', url)
  })
  app.on('second-instance', (_, commandLine) => {
    commandLine.forEach((url) => {
      if (SCHEME_REGEXP.test(url))
        win?.webContents.send('schema:login', url)
    })
  })
}
