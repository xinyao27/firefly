import { EventEmitter } from 'node:events'
import path from 'node:path'
import type { BrowserWindowConstructorOptions } from 'electron'
import { BrowserWindow, shell } from 'electron'
import is from 'electron-is'
interface Params {
  onInit: (window: BrowserWindow) => void
  onDestroy?: () => void
}

class MainWindow extends EventEmitter {
  option: BrowserWindowConstructorOptions

  window: BrowserWindow | null

  constructor({ onInit, onDestroy }: Params) {
    super()

    const defaultOptions: BrowserWindowConstructorOptions = {
      title: process.env.APP_NAME,
      width: 1200,
      height: 900,
      minWidth: 800,
      minHeight: 600,
      titleBarStyle: 'hidden',
      icon: path.join(process.env.PUBLIC, 'favicon.ico'),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    }
    if (is.windows()) {
      defaultOptions.frame = false
    }
    this.option = defaultOptions
    this.window = null
    this.init(this.option, onInit, onDestroy)
  }

  init(
    options: BrowserWindowConstructorOptions,
    onInit: Params['onInit'] = () => {},
    onDestroy?: Params['onDestroy'],
  ) {
    this.window = new BrowserWindow(options)
    onInit(this.window)

    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
      this.window.loadURL(process.env.VITE_DEV_SERVER_URL)
      // Open devTool if the app is not packaged
      this.window.webContents.openDevTools()
    }
    else {
      const indexHtml = path.join(process.env.DIST, 'index.html')
      this.window.loadFile(indexHtml)
    }

    // Test actively push message to the Electron-Renderer
    this.window.webContents.on('did-finish-load', () => {
      this.window?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    this.window.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) shell.openExternal(url)
      return { action: 'deny' }
    })

    this.window.on('closed', () => {
      this.window = null
      onDestroy?.()
    })
  }

  destroy() {
    this.window?.destroy()
  }

  show() {
    if (this.window) {
      if (this.window.isMinimized()) this.window.restore()
      this.window.show()
    }
  }

  hide() {
    this.window?.hide()
  }

  minimize() {
    this.window?.minimize()
  }
}

export default MainWindow
