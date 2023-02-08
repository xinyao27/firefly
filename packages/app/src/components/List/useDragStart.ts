import { join } from 'path'
import { ipcRenderer } from 'electron'
import type { MessageModel } from '~~/models/Message'
import { getFinalFilePath } from '~/utils'

export function useDragStart(message: MessageModel) {
  async function handleDragStart() {
    if (message.filePath) {
      const iconPath = message.thumb ? await getFinalFilePath(message.thumb) : join(`${process.env.PUBLIC}/icons/GenericDocumentIcon.png`)
      await ipcRenderer.send('api:dragStart', await getFinalFilePath(message.filePath), iconPath)
    }
  }

  return { handleDragStart }
}
