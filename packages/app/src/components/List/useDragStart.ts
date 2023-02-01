import { join } from 'path'
import { ipcRenderer } from 'electron'
import { getAppDataPath } from '~/api'
import type { MessageModel } from '~~/models/Message'

export function useDragStart(message: MessageModel) {
  async function handleDragStart() {
    if (message.filePath) {
      const appDataPath = await getAppDataPath()
      const iconPath = `${appDataPath}${message.thumb}` || `${process.env.PUBLIC}/icons/GenericDocumentIcon.png`
      await ipcRenderer.send('api:dragStart', join(appDataPath, message.filePath), iconPath)
    }
  }

  return { handleDragStart }
}
