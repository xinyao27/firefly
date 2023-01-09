import { release } from 'node:os'
import path from 'node:path'
import { fork } from 'node:child_process'
import { BrowserWindow, app, protocol, shell } from 'electron'
import log from 'electron-log'
import ipcMain from './ipcMain'

process.env.DIST_ELECTRON = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST
process.env.APP_NAME = 'Firefly'
process.env.APP_DATA_PATH = app.getPath('userData')

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(process.env.APP_NAME)

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = path.join(__dirname, './preload.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = path.join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: process.env.APP_NAME,
    width: 1440,
    height: 1080,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    icon: path.join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  }
  else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  const serverPath = path.resolve(__dirname, 'server.js')
  const child = fork(serverPath, {
    env: { ...process.env },
    stdio: 'pipe',
  })
  child.on('message', (msg) => {
    log.info(msg)
  })
  child.on('error', (err) => {
    log.error('Child process got error:', err)
  })
  child.on('close', (code) => {
    log.info('server: close code: ', code)
  })
  child.stdout?.on('data', (data) => {
    log.info('server: ', data.toString())
  })
  child.stderr?.on('data', (data) => {
    log.error('server: ', data.toString())
  })
  app.on('quit', () => {
    child.kill(0)
  })

  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''))
    callback(pathname)
  })

  createWindow()
  ipcMain(win)
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  }
  else {
    createWindow()
  }
})
