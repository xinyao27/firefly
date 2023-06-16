import path from 'node:path'
import type { BrowserWindowConstructorOptions } from 'electron'
import { BrowserWindow, app, protocol } from 'electron'
import { is } from '@firefly/common'
import { emitSettings, initSettings } from './settings'
import { initApp } from './app'
import { initWindows } from './windows'
import './autoUpdater'
import './sentry'
import { createAppProtocol, createDefaultProtocol } from './protocol'

process.env.ROOT = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = path.join(process.env.ROOT, '.output/public')
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

// Set application name for Windows 10+ notifications
if (process.platform === 'win32')
  app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
])

let win: BrowserWindow | null
const preload = path.join(process.env.DIST, 'preload.js')

function bootstrap() {
  initSettings()
  initApp()
  initWindows()
  createAppProtocol()
  emitSettings()

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
      webSecurity: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
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

  if (app.isPackaged) {
    win.loadURL('app://renderer/index.html')
  }
  else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL!)
    win.webContents.openDevTools()
  }

  createDefaultProtocol(win)
}

app.on('window-all-closed', () => {
  win = null
  if (!is.macOS())
    app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized())
      win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length)
    allWindows[0].focus()
  else
    bootstrap()
})

app.whenReady().then(bootstrap)
