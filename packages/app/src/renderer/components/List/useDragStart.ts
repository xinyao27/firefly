import type { MessageModel } from '~/models/Message'

export function useDragStart(message: MessageModel) {
  async function handleDragStart() {
    if (message.filePath) {
      // TODO 待确认
      const iconPath = message.thumb ? await $api.getFinalFilePath(message.thumb) : '/icons/GenericDocumentIcon.png'
      await $electron.ipcRenderer.send('api:dragStart', await $api.getFinalFilePath(message.filePath), iconPath)
    }
  }

  return { handleDragStart }
}
