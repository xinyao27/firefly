import type { MessageModel } from '~/models/Message'

export function useDragStart(message: MessageModel) {
  async function handleDragStart() {
    if (message.path) {
      // TODO 待确认
      const iconPath = message.thumb ? await $api.getFinalPath(message.thumb) : '/icons/GenericDocumentIcon.png'
      await $electron.ipcRenderer.send('api:dragStart', await $api.getFinalPath(message.path), iconPath)
    }
  }

  return { handleDragStart }
}
