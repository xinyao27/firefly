import dayjs from 'dayjs'
import type { Ref } from 'vue'
import { createDir, exists, writeBinaryFile } from '@tauri-apps/api/fs'
import { appDataDir, basename, extname, join } from '@tauri-apps/api/path'
import { useMessage } from 'naive-ui'

import { getCategoryAndThumb } from '~/utils'

export function useFileDropZone(target: Ref<HTMLDivElement | undefined>) {
  const message = useMessage()
  const uploadStore = useUploadStore()
  const messagesStore = useMessagesStore()

  async function handleFile(file: File) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = () => {
        resolve(reader.result as ArrayBuffer)
      }
      reader.onerror = (e: any) => reject(e)
    })
  }
  async function handleDrop(data: File[] | null, selectText?: string) {
    const files: {
      raw?: ArrayBuffer
      name: string
      size: number
      type: string
      createdAt: Date
    }[] = []
    if (data && Array.isArray(data)) {
      for (const file of data) {
        const arrayBuffer = await handleFile(file)
        files.push({
          raw: arrayBuffer,
          name: file.name,
          size: file.size,
          type: file.type,
          createdAt: dayjs(file.lastModified).toDate(),
        })
      }
    }
    else if (typeof selectText === 'string') {
      files.push({
        name: selectText,
        size: selectText.length,
        type: 'text/plain',
        createdAt: dayjs().toDate(),
      })
    }

    uploadStore.startUpload(files.length)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      uploadStore.setCurrentIndex(i)
      try {
        const relativeDirPath = '/files'
        const absoluteDirPath = await join(await appDataDir(), relativeDirPath)
        const isExists = await exists(absoluteDirPath)
        if (!isExists) {
          await createDir(absoluteDirPath, { recursive: true })
        }
        const relativeFilePath = await join(relativeDirPath, file.name)
        const absoluteFilePath = await join(absoluteDirPath, file.name)
        if (file.raw) {
          await writeBinaryFile(absoluteFilePath, file.raw)
        }
        const fileExt = data ? await extname(file.name) : undefined
        const link = fileExt === 'url' ? selectText : ''
        const { category, thumb } = await getCategoryAndThumb({
          ext: fileExt,
          filePath: relativeFilePath,
        })
        const content = file.type === 'text/plain'
          ? (file.raw ? new TextDecoder('utf-8').decode(file.raw) : selectText)
          : undefined
        const fileName = await basename(file.name, fileExt ? `.${fileExt}` : '')
        await messagesStore.add({
          title: fileName,
          thumb,
          createdAt: file.createdAt,
          updatedAt: file.createdAt,
          category,
          content,
          fileExt,
          filePath: relativeFilePath,
          fileFrom: 'pc',
          link,
          size: file.size,
        })
      }
      catch (error: any) {
        message.error(error)
        uploadStore.stopUpload()
      }
    }
    uploadStore.stopUpload()
  }

  const isOverDropZone = ref(false)
  let counter = 0
  useEventListener<DragEvent>(target, 'dragenter', (event) => {
    event.preventDefault()
    counter += 1
    isOverDropZone.value = true
  })
  useEventListener<DragEvent>(target, 'dragover', (event) => {
    event.preventDefault()
  })
  useEventListener<DragEvent>(target, 'dragleave', (event) => {
    event.preventDefault()
    counter -= 1
    if (counter === 0) { isOverDropZone.value = false }
  })
  useEventListener<DragEvent>(target, 'drop', (event) => {
    event.preventDefault()
    counter = 0
    isOverDropZone.value = false
    const files = Array.from(event.dataTransfer?.files ?? [])
    handleDrop(files.length === 0 ? null : files, event.dataTransfer?.getData('text'))
  })
  return { isOverDropZone }
}
