import { EventEmitter } from 'node:events'
import path from 'node:path'
import { fork } from 'node:child_process'
import { release } from 'node:os'
import { BrowserWindow, app, protocol } from 'electron'
import log from 'electron-log'
import { platform } from '@electron-toolkit/utils'
import ipcMain from './ipcMain'
import MainWindow from './windows/main'
import { SCHEMA, protocolRequestHandler } from './protocol'
import initEnv from './initEnv'

class Launcher extends EventEmitter {
  mainWindow?: MainWindow

  constructor() {
    super()

    this.makeSingleInstance(this.init.bind(this))
  }

  init() {
    initEnv()

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

    protocol.registerBufferProtocol(SCHEMA, protocolRequestHandler)

    this.mainWindow = new MainWindow({
      onInit: (window) => {
        ipcMain(window)
      },
    })
  }

  makeSingleInstance(callback: () => void) {
    // Disable GPU Acceleration for Windows 7
    if (release().startsWith('6.1')) app.disableHardwareAcceleration()

    // Set application name for Windows 10+ notifications
    if (platform.isWindows) {
      app.setAppUserModelId(process.env.APP_NAME!)
      app.commandLine.appendSwitch('force_high_performance_gpu')
    }

    // protocol.registerSchemesAsPrivileged([
    //   {
    //     scheme: SCHEMA,
    //     privileges: {
    //       standard: true,
    //       secure: true,
    //     },
    //   },
    // ])

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
