import type { BlockModel } from '~/models/Block'

export function useDragStart(block: BlockModel) {
  async function handleDragStart() {
    if (block.path) {
      // TODO 待确认
      const iconPath = block.thumb ? await $api.getFinalPath(block.thumb) : '/icons/GenericDocumentIcon.png'
      await $electron.ipcRenderer.send('api:dragStart', await $api.getFinalPath(block.path), iconPath)
    }
  }

  return { handleDragStart }
}
