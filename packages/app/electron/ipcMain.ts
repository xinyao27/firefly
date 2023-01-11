import { join } from 'node:path'
import type { BrowserWindow } from 'electron'
import { app, ipcMain, nativeImage } from 'electron'
import sharp from 'sharp'
import { remove } from 'fs-extra'

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

  ipcMain.on('api:dragStart', async(event, filePath, iconPath) => {
    const thumbPath = join(app.getPath('temp'), 'thumb.png')
    await sharp(iconPath).png().toFile(thumbPath)
    const icon = nativeImage.createFromPath(thumbPath).resize({ width: 80 })
    event.sender.startDrag({
      file: filePath,
      icon,
    })
    await remove(thumbPath)
  })
}
