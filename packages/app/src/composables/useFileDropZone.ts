import type { Ref } from 'vue'
import { upload } from '@firefly/common'
import { useMessage } from 'naive-ui'

export function useFileDropZone(target: Ref<HTMLDivElement | undefined>) {
  const block = useMessage()
  const blockStore = useBlockStore()

  const isOverDropZone = ref(false)
  let counter = 0
  useEventListener<DragEvent>(target, 'drag', (e) => {
    e.preventDefault()

    counter = 0
    isOverDropZone.value = false
  })
  useEventListener<DragEvent>(target, 'dragenter', (e) => {
    e.preventDefault()

    counter += 1
    isOverDropZone.value = true
  })
  useEventListener<DragEvent>(target, 'dragover', (e) => {
    e.preventDefault()
  })
  useEventListener<DragEvent>(target, 'dragleave', (e) => {
    e.preventDefault()

    counter -= 1
    if (counter === 0)
      isOverDropZone.value = false
  })
  useEventListener<DragEvent>(target, 'drop', async (e) => {
    e.preventDefault()

    if (counter) {
      const sources = Array.from(e.dataTransfer?.files ?? [])
      const files = sources.filter(v => !v.path)
      const jsonFiles = sources.filter(v => !!v.path).map(v => ({
        name: v.name,
        filepath: v.path,
        updatedAt: v.lastModified,
        size: v.size,
        mimetype: v.type,
      }))
      upload({
        files: files.length === 0 ? undefined : files,
        jsonFiles: jsonFiles.length === 0 ? undefined : jsonFiles,
        text: e.dataTransfer?.getData('text'),
        from: 'pc',
      })
        .then((res) => {
          block.success(res.statusText)
          blockStore.find()
        })
        .catch((error) => {
          block.error(error.block || error.stack || error.code)
        })
    }
    counter = 0
    isOverDropZone.value = false
  })
  return { isOverDropZone }
}
