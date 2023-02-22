import { join } from 'node:path'
import { writeFile } from 'fs-extra'
import type { BrowserWindow, SaveDialogOptions } from 'electron'
import { clipboard, dialog, ipcMain, nativeImage, shell } from 'electron'
import sharp from 'sharp'
import getMetadata from 'metadata-scraper'
import clipboardEx from 'electron-clipboard-ex'
import { MESSAGE_SAVE_DIR_PATH } from '~/constants'

/**
 * https://github.com/rubickCenter/rubick/blob/master/src/common/utils/getCopyFiles.ts
 */
export interface ClipboardWrite {
  filePaths?: string[]
  texts?: string[]
  imagePath?: string
}
export async function clipboardWrite({ filePaths, texts, imagePath }: ClipboardWrite) {
  if (filePaths) {
    return clipboardEx.writeFilePaths(filePaths)
  }
  if (texts) {
    return clipboard.writeText(texts.join('\n'))
  }
  if (imagePath) {
    return clipboardEx.putImage(imagePath)
  }
}

export function getAppDataPath() {
  return process.env.APP_DATA_PATH!
}
export function getMessageDirPath() {
  return join(getAppDataPath(), MESSAGE_SAVE_DIR_PATH)
}
export function getFinalFilePath(filePath: string) {
  return join(getAppDataPath(), filePath)
}
export default function(win: BrowserWindow | null) {
  ipcMain.handle('get:appDataPath', getAppDataPath)
  ipcMain.handle('get:messageDirPath', getMessageDirPath)
  ipcMain.handle('get:finalFilePath', (_, filePath: string) => getFinalFilePath(filePath))

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
  ipcMain.handle('api:clipboardWrite', (_, options: ClipboardWrite) => clipboardWrite(options))
  ipcMain.handle('api:shellOpenPath', (_, path: string) => shell.openPath(path))
  ipcMain.handle('api:shellOpenExternal', (_, path: string) => shell.openExternal(path))
  ipcMain.handle('api:shellShowItemInFolder', (_, path: string) => shell.showItemInFolder(path))
  ipcMain.handle('api:fsWriteFile', (_, path: string, buffer: string | Buffer) => writeFile(path, buffer, 'utf-8'))
  ipcMain.handle('api:getWebsiteMetadata', (_, url: string) => getMetadata(url))
}
