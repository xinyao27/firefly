import path from 'node:path'
import type { BrowserWindowConstructorOptions } from 'electron'
import { BrowserWindow, app } from 'electron'
import { is } from '@firefly/common'

process.env.ROOT = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.ROOT, 'public')
  : path.join(process.env.ROOT, '.output/public')
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

let win: BrowserWindow
const preload = path.join(process.env.DIST, 'preload.js')

function bootstrap() {
  const options: BrowserWindowConstructorOptions = {
    width: 1280,
    height: 820,
    minHeight: 600,
    minWidth: 800,
    title: 'Firefly',
    center: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
    },
  }
  if (is.macOS()) {
    // options.backgroundColor = 'rgba(255,255,255,0.2)'
    options.titleBarStyle = 'hiddenInset'
    options.backgroundMaterial = 'mica'
    options.vibrancy = 'under-window'
    options.visualEffectState = 'followWindow'
  }

  win = new BrowserWindow(options)

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  }
  else {
    win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
  }
}

app.whenReady().then(bootstrap)
