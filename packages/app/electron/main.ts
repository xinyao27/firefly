import path from 'node:path'
import { BrowserWindow, app } from 'electron'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ ├─┬ renderer
// │ │ └── index.html

process.env.ROOT = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.ROOT, 'public')
  : path.join(process.env.ROOT, '.output/public')
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

let win: BrowserWindow
const preload = path.join(process.env.DIST, 'preload.js')

function bootstrap() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minHeight: 600,
    minWidth: 800,
    title: 'Firefly',
    center: true,
    titleBarStyle: 'hiddenInset',
    backgroundMaterial: 'mica',
    vibrancy: 'under-window',
    backgroundColor: 'rgba(255,255,255,0.2)',
    visualEffectState: 'followWindow',
    webPreferences: {
      preload,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL)
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    // win.webContents.openDevTools()

  else
    win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
}

app.whenReady().then(bootstrap)
