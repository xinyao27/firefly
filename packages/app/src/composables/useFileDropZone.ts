import type { Ref } from 'vue'
import { upload } from '@firefly/utils'
import { useMessage } from 'naive-ui'

export function useFileDropZone(target: Ref<HTMLDivElement | undefined>) {
  const message = useMessage()
  const messageStore = useMessageStore()

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
    if (counter === 0) { isOverDropZone.value = false }
  })
  useEventListener<DragEvent>(target, 'drop', (e) => {
    e.preventDefault()

    if (counter) {
      const files = Array.from(e.dataTransfer?.files ?? [])
      upload(files.length === 0 ? null : files, e.dataTransfer?.getData('text'))
        .then(() => messageStore.find())
        .catch((error) => {
          message.error(error.message || error.stack || error.code)
        })
    }
    counter = 0
    isOverDropZone.value = false
  })
  return { isOverDropZone }
}
