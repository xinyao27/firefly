import type { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'

export default function(win: BrowserWindow | null) {
  ipcMain.handle('get:appDataPath', () => process.env.APP_DATA_PATH)

  ipcMain.handle('win:minimize', () => win?.minimize())
  ipcMain.handle('win:toggleMaximize', () => {
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize()
      }
      else {
        win.maximize()
      }
    }
  })
  ipcMain.handle('win:close', () => win?.close())
  ipcMain.handle('win:setAlwaysOnTop', (_, onTop: boolean) => win?.setAlwaysOnTop(onTop))
}
