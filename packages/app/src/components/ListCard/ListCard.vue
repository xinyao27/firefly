<script setup lang="ts">
import { join } from 'path'
import dayjs from 'dayjs'
import normalize from 'normalize-path'
import { ipcRenderer } from 'electron'
import { useContextMenuOptions } from './contextMenu'
import { useCardClick } from './cardClick'
import { byteSize } from '~~/utils'
import { useContextMenu } from '~/composables/useContextMenu'
import type { MessageModel } from '~~/models/Message'
import { getAppDataPath } from '~/api'

const props = defineProps<{
  size: number
  message: MessageModel
}>()

const messageStore = useMessageStore()
const message = props.message
const description = computed(() => {
  const updatedAt = dayjs(message.updatedAt).format('YYYY/MM/DD HH:mm')
  switch (message.category) {
    case 'text': {
      if (!message.size && message.size !== 0) {
        return updatedAt
      }
      const r = byteSize(message.size)
      return `${r?.number} ${r?.unit}`
    }
    case 'image': {
      if (message.metadata?.width && message.metadata?.height) {
        return `${message.metadata.width} × ${message.metadata.height}`
      }
      return updatedAt
    }
    case 'link':
      return message.link || updatedAt
    case 'other':
      return updatedAt
    default:
      return updatedAt
  }
})
const thumb = computedAsync(async() => {
  switch (message.category) {
    case 'image':
      return normalize(await getAppDataPath() + message.thumb)
    case 'text':
      return null
    case 'link':
      return normalize(`${process.env.PUBLIC}/icons/BookmarkIcon.png`)
    default:
      return normalize(`${process.env.PUBLIC}/icons/GenericDocumentIcon.png`)
  }
})
const isSelected = computed(() => messageStore.selectedMessageIds.includes(message.id))

const { handleClick, handleDoubleClick } = useCardClick(message.id)
const contextMenuOptions = useContextMenuOptions()
const { show: showContextMenu } = useContextMenu(contextMenuOptions.value)
function handleContextMenu(e: MouseEvent) {
  if (messageStore.selectedMessageIds.length < 1) {
    handleClick()
  }
  else if (!messageStore.selectedMessageIds.includes(message.id)) {
    handleClick()
  }
  showContextMenu(e)
}

async function handleDragStart() {
  if (props.message.filePath) {
    const iconPath = thumb.value || normalize(`${process.env.PUBLIC}/icons/GenericDocumentIcon.png`)
    await ipcRenderer.send('api:dragStart', join(await getAppDataPath(), props.message.filePath), iconPath)
  }
}
</script>

<template>
  <div
    inline-flex flex-col text-center overflow-hidden relative
    :style="{ width: `${props.size}px` }"
    data-message-card
    :data-id="message.id"
    @click.capture.prevent.stop="handleClick"
    @contextmenu.capture.prevent.stop="handleContextMenu"
  >
    <div
      overflow-hidden flex items-center justify-center relative select-none
      :style="{ width: `${props.size}px`, height: `${props.size}px` }"
      data-message-card-select-area
      :draggable="true"
      @dblclick.capture.prevent.stop="handleDoubleClick"
      @dragstart="handleDragStart"
    >
      <img
        v-if="thumb"
        w-auto h-full max-w-none
        data-message-card-select-area
        loading="lazy"
        :src="thumb"
        :alt="message.title"
      >
      <div
        v-if="!thumb && message.category === 'text'"
        absolute top-0 right-0 bottom-0 left-0 bg-dark-200 border-2 border-dark-500 p-2 text-left select-none
        data-message-card-select-area
      >
        {{ message.content }}
      </div>
      <div
        v-if="isSelected"
        absolute top-0 right-0 bottom-0 left-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500
        data-message-card-select-area
      />
      <div
        v-if="message.fileExt && message.category !== 'text'"
        bg-black bg-opacity-60 text-xs font-semibold px-1 absolute rounded left-1 top-1 transform scale-90 select-none
        data-message-card-select-area
      >
        {{ message.fileExt.toUpperCase() }}
      </div>
    </div>
    <div text-xs line-clamp-2 break-words leading-4 mt-2 select-none>
      {{ message.title }}
    </div>
    <div text-xs text-neutral-500 mt-1 font-600 line-clamp-2 break-words select-none>
      {{ description }}
    </div>
  </div>
</template>
