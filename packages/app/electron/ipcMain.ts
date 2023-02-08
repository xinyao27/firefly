import type { BrowserWindow, SaveDialogOptions } from 'electron'
import { dialog, ipcMain, nativeImage } from 'electron'
import sharp from 'sharp'

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
  ipcMain.handle('win:showSaveDialog', async(_, options: SaveDialogOptions) => {
    const { canceled, filePath } = await dialog.showSaveDialog(options)
    if (canceled) return false
    return filePath
  })

  ipcMain.on('api:dragStart', async(event, filePath, iconPath) => {
    const buffer = await sharp(iconPath).png().toBuffer()
    const icon = nativeImage.createFromBuffer(buffer).resize({ width: 180 })
    event.sender.startDrag({
      file: filePath,
      icon,
    })
  })
}
