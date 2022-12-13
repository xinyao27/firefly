<script setup lang="ts">
import type { FileEntry } from '@tauri-apps/api/fs'
import { copyFile, createDir, exists, readDir } from '@tauri-apps/api/fs'
import { appDataDir, basename, join } from '@tauri-apps/api/path'
import { invoke } from '@tauri-apps/api/tauri'
import type { UnlistenFn } from '@tauri-apps/api/event'
import { TauriEvent, listen } from '@tauri-apps/api/event'
import { useMessage } from 'naive-ui'
import type { ID } from '~/models/Message'

const message = useMessage()
const configsStore = useConfigsStore()
const messagesStore = useMessagesStore()
const uploadStore = useUploadStore()
async function handleGetAllFilePaths(paths: string[]) {
  const filePaths = []
  for (const path of paths) {
    const isDirectory = await invoke('is_directory', { path })
    if (isDirectory) {
      const entries = await readDir(path, { recursive: true })
      processEntries(entries)
      function processEntries(entries: FileEntry[]) {
        for (const entry of entries) {
          if (entry.children) {
            processEntries(entry.children)
          }
          else if (entry.path) {
            filePaths.push(entry.path)
          }
        }
      }
    }
    else {
      filePaths.push(path)
    }
  }
  return filePaths
}
const loadingBarTargetRef = ref<HTMLElement>()
async function handleDrop(filePaths: string[]) {
  uploadStore.startUpload(filePaths.length)
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i]
    uploadStore.setCurrentIndex(i)
    try {
      const dir = await join(await appDataDir(), '/files')
      const isExists = await exists(dir)
      if (!isExists) {
        await createDir(dir, { recursive: true })
      }
      const fileName = await join(dir, await basename(filePath))
      await copyFile(filePath, fileName)
    }
    catch (error: any) {
      message.error(error)
      uploadStore.stopUpload()
    }
  }
  uploadStore.stopUpload()
}
let unListenDrop: UnlistenFn
let unListenDropHover: UnlistenFn
let unListenDropCancel: UnlistenFn
const isOverDropZone = ref(false)
onMounted(async() => {
  unListenDrop = await listen<string[]>(TauriEvent.WINDOW_FILE_DROP, async(event) => {
    isOverDropZone.value = false
    const filePaths = await handleGetAllFilePaths(event.payload)
    handleDrop(filePaths)
  })
  unListenDropHover = await listen(TauriEvent.WINDOW_FILE_DROP_HOVER, () => {
    isOverDropZone.value = true
  })
  unListenDropCancel = await listen(TauriEvent.WINDOW_FILE_DROP_CANCELLED, () => {
    isOverDropZone.value = false
  })
})
onUnmounted(() => {
  unListenDrop?.()
  unListenDropHover?.()
  unListenDropCancel?.()
})

const dragView = ref<HTMLDivElement>()
const selecting = ref(false)
const startX = ref<number | null>(null)
const startY = ref<number | null>(null)
const endX = ref<number | null>(null)
const endY = ref<number | null>(null)
const selectAreaX = computed(() => {
  if (startX.value !== null && endX.value !== null) {
    return Math.min(startX.value, endX.value)
  }
  return null
})
const selectAreaY = computed(() => {
  if (startY.value !== null && endY.value !== null) {
    return Math.min(startY.value, endY.value)
  }
  return null
})
const selectAreaWidth = computed(() => {
  if (startX.value !== null && endX.value !== null) {
    return Math.abs(startX.value - endX.value)
  }
  return null
})
const selectAreaHeight = computed(() => {
  if (startY.value !== null && endY.value !== null) {
    return Math.abs(startY.value - endY.value)
  }
  return null
})
const allMessageCardRects = ref<{ rect: DOMRect; element: Element }[] | null>(null)
function handleSelectMessageCardAndGetIds() {
  const selectedMessages: ID[] = []
  if (allMessageCardRects.value) {
    for (const { rect, element } of allMessageCardRects.value) {
      if (
        selectAreaX.value !== null
        && selectAreaY.value !== null
        && selectAreaWidth.value !== null
        && selectAreaHeight.value !== null
        && selectAreaX.value < rect.x + rect.width + (dragView.value?.scrollLeft ?? 0)
        && selectAreaX.value + selectAreaWidth.value > rect.x + (dragView.value?.scrollLeft ?? 0)
        && selectAreaY.value < rect.y + rect.height + (dragView.value?.scrollTop ?? 0)
        && selectAreaY.value + selectAreaHeight.value > rect.y + (dragView.value?.scrollTop ?? 0)
      ) {
        // @ts-expect-error noop
        selectedMessages.push(element.dataset.id)
      }
    }
    messagesStore.selectMessageIds(selectedMessages)
  }
}
function handleMouseDown(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()

  // 鼠标左键按下
  if (e.button === 0) {
    startX.value = e.x + (dragView.value?.scrollLeft ?? 0)
    startY.value = e.y + (dragView.value?.scrollTop ?? 0) - configsStore.rootPaddingTop
    selecting.value = true

    const messageCardRects = Array.from(document.querySelectorAll('[data-message-card]')).map(v => ({
      rect: v.getBoundingClientRect(),
      element: v,
    }))
    allMessageCardRects.value = messageCardRects
  }
}
useEventListener('mouseup', (e) => {
  e.stopPropagation()
  e.preventDefault()

  if (selecting.value) {
    if (startX.value !== endX.value || startY.value !== endY.value) {
      handleSelectMessageCardAndGetIds()
    }
    selecting.value = false
    allMessageCardRects.value = null
    startX.value = null
    startY.value = null
    endX.value = null
    endY.value = null
  }
})
useEventListener('mousemove', (e) => {
  e.stopPropagation()
  e.preventDefault()

  if (selecting.value) {
    endX.value = e.x + (dragView.value?.scrollLeft ?? 0)
    endY.value = e.y + (dragView.value?.scrollTop ?? 0) - configsStore.rootPaddingTop
    handleSelectMessageCardAndGetIds()
  }
})
</script>

<template>
  <NLoadingBarProvider
    :to="loadingBarTargetRef"
    container-style="position: absolute;"
  >
    <div
      ref="loadingBarTargetRef"
      absolute bottom-0 left-0 w-screen h-2px pointer-events-none overflow-hidden
    />
    <UploadProgress />
    <div
      id="drag-view"
      ref="dragView"
      flex-auto px-4 relative z-36
      :overflow="isOverDropZone ? 'hidden' : 'overlay'"
      @mousedown="handleMouseDown"
    >
      <!-- select area -->
      <div
        v-show="
          selecting
            && selectAreaX !== null
            && selectAreaY !== null
            && selectAreaWidth !== null
            && selectAreaHeight !== null
        "
        bg-opacity-20 bg-dark-100 border-1 border-dark-50 absolute
        :style="{
          left: `${selectAreaX}px`,
          top: `${selectAreaY}px`,
          width: `${selectAreaWidth}px`,
          height: `${selectAreaHeight}px`,
        }"
      />
      <Transition>
        <div
          v-show="isOverDropZone"
          fixed top-8 right-0 bottom-0 left-0 z-35 select-none bg-opacity-20 bg-blue-500 border-2 border-blue-500
        />
      </Transition>
      <Transition>
        <NButton
          v-show="isOverDropZone"
          fixed bottom-6 w-280px ml--140px z-35 transform select-none animate-bounce color-white
          left="1/2"
          bg="blue-500"
          type="primary"
          icon-placement="left"
          size="large"
        >
          <template #icon>
            <i i-ri-inbox-archive-line />
          </template>
          将文件拖放到这里添加
        </NButton>
      </Transition>

      <slot />
    </div>
  </NLoadingBarProvider>
</template>

<style scoped lang="sass">
#drag-view
  &::-webkit-scrollbar-thumb
    @apply bg-transparent
  &:hover
    &::-webkit-scrollbar-thumb
      @apply bg-dark-50
</style>
