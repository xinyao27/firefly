// TODO
// import { join } from 'path'
import type { MessageModel } from '~/models/Message'
import { getFinalFilePath } from '~renderer/utils'

export function useDragStart(message: MessageModel) {
  async function handleDragStart() {
    if (message.filePath) {
      const iconPath = message.thumb ? await getFinalFilePath(message.thumb) : join(`${process.env.PUBLIC}/icons/GenericDocumentIcon.png`)
      await window.$electron.ipcRenderer.send('api:dragStart', await getFinalFilePath(message.filePath), iconPath)
    }
  }

  return { handleDragStart }
}
