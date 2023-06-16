import { BrowserWindow, app, ipcMain, screen } from 'electron'
import { getSelectedText } from './utils'

let assistantWindow: BrowserWindow | null = null

export async function showAssistantWindow() {
  const cursorScreenPoint = screen.getCursorScreenPoint()
  if (assistantWindow) {
    assistantWindow.setPosition(cursorScreenPoint.x, cursorScreenPoint.y)
    assistantWindow.show()
  }
  else {
    assistantWindow = new BrowserWindow({
      width: 672,
      height: 431,
      x: cursorScreenPoint.x,
      y: cursorScreenPoint.y,
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    })

    if (app.isPackaged) {
      await assistantWindow.loadURL('app://renderer/index.html#/assistant')
    }
    else {
      await assistantWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL!}/#/assistant`)
      assistantWindow.webContents.openDevTools()
    }
  }

  assistantWindow.setAlwaysOnTop(true)
  assistantWindow.show()
  assistantWindow.setAlwaysOnTop(false)
  assistantWindow.focus()
}

export async function hideAssistantWindow() {
  assistantWindow?.hide()
}

export async function showAssistantWindowWithSelectedText() {
  const selectedText = await getSelectedText()
  await showAssistantWindow()
  setTimeout(() => {
    assistantWindow?.webContents.send('assistant:setText', selectedText)
  }, 300)
}

export async function setAssistantWindowAlwaysOnTop(alwaysOnTop: boolean) {
  assistantWindow?.setAlwaysOnTop(alwaysOnTop)
}

export function initWindows(): void {
  ipcMain.handle('windows:showAssistantWindow', () => showAssistantWindow())
  ipcMain.handle('windows:showAssistantWindowWithSelectedText', () => showAssistantWindowWithSelectedText())
  ipcMain.handle('windows:hideAssistantWindow', () => hideAssistantWindow())
  ipcMain.handle('windows:setAssistantWindowAlwaysOnTop', (_, alwaysOnTop: boolean) => setAssistantWindowAlwaysOnTop(alwaysOnTop))
}
