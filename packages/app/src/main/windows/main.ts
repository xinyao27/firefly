import { EventEmitter } from 'node:events'
import path from 'node:path'
import type { BrowserWindowConstructorOptions } from 'electron'
import { BrowserWindow, shell } from 'electron'
import { is, platform } from '@electron-toolkit/utils'
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
      width: is.dev ? 1920 : 1200,
      height: is.dev ? 1080 : 900,
      minWidth: 800,
      minHeight: 600,
      titleBarStyle: 'hidden',
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        sandbox: false,
      },
    }
    if (platform.isWindows) {
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

    if (is.dev) {
      this.window.webContents.on('did-frame-finish-load', () => {
        this.window?.webContents.once('devtools-opened', () => {
          this.window?.focus()
        })
        this.window?.webContents.openDevTools()
      })
      this.window.webContents.openDevTools()
    }

    if (is.dev && process.env.ELECTRON_RENDERER_URL) {
      this.window.loadURL(process.env.ELECTRON_RENDERER_URL)
    }
    else {
      this.window.loadFile(path.join(__dirname, '../renderer/index.html'))
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
