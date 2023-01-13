import { EventEmitter } from 'node:events'
import path from 'node:path'
import { fork } from 'node:child_process'
import { release } from 'node:os'
import { BrowserWindow, app, protocol } from 'electron'
import log from 'electron-log'
import { is } from 'electron-util'
import ipcMain from './ipcMain'
import MainWindow from './windows/main'

class Launcher extends EventEmitter {
  mainWindow?: MainWindow

  constructor() {
    super()

    this.makeSingleInstance(this.init.bind(this))
  }

  init() {
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

    this.mainWindow = new MainWindow({
      onInit: (window) => {
        if (is.development) {
          window.webContents.on('did-frame-finish-load', () => {
            window.webContents.once('devtools-opened', () => {
              window.focus()
            })
            window.webContents.openDevTools()
          })
          window.webContents.openDevTools()
        }
        ipcMain(window)
      },
      onDestroy: () => { },
    })
  }

  makeSingleInstance(callback: () => void) {
    // Disable GPU Acceleration for Windows 7
    if (release().startsWith('6.1')) app.disableHardwareAcceleration()

    // Set application name for Windows 10+ notifications
    if (is.windows) {
      app.setAppUserModelId(process.env.APP_NAME!)
      app.commandLine.appendSwitch('force_high_performance_gpu')
    }

    const gotSingleLock = app.requestSingleInstanceLock()
    if (!gotSingleLock) {
      app.quit()
    }
    else {
      app.on('second-instance', () => {
        this.mainWindow?.show()
      })
    }

    app
      .whenReady()
      .then(callback)
      .catch(err => log.error(err))

    app.on('activate', () => {
      const allWindows = BrowserWindow.getAllWindows()
      if (allWindows.length) {
        allWindows[0].focus()
      }
      else {
        callback()
      }
    })

    app.on('window-all-closed', () => {
      app.quit()
    })
  }
}

export default Launcher
