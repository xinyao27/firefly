<script setup lang="ts">
import { appDataDir } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import dayjs from 'dayjs'
import normalize from 'normalize-path'
import type { Message } from '~/models/Message'
import { byteSize } from '~/utils'

const props = defineProps<{
  size: number
  message: Message
}>()

const messagesStore = useMessagesStore()
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
      if (message.width && message.height) {
        return `${message.width} × ${message.height}`
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
const appDataDirPath = ref('')
onMounted(async() => {
  appDataDirPath.value = await appDataDir()
})
const thumb = computed(() => {
  switch (message.category) {
    case 'image':
      return convertFileSrc(normalize(appDataDirPath.value + message.thumb))
    case 'text':
      return null
    default:
      return '/icons/GenericDocumentIcon.png'
  }
})

const isSelected = computed(() => messagesStore.selectedMessageIds.includes(message.id))
</script>

<template>
  <div
    inline-flex flex-col text-center overflow-hidden
    :style="{ width: `${props.size}px` }"
    data-message-card
    :data-id="message.id"
  >
    <div
      overflow-hidden flex items-center justify-center relative
      :style="{ width: `${props.size}px`, height: `${props.size}px` }"
    >
      <img
        v-if="thumb"
        w-auto h-full max-w-none
        :src="thumb" :alt="message.title"
      >
      <div
        v-if="!thumb && message.category === 'text'"
        absolute top-0 right-0 bottom-0 left-0 bg-dark-200 border-2 border-dark-500 p-2 text-left select-none
      >
        {{ message.content }}
      </div>
      <div
        v-if="isSelected"
        absolute top-0 right-0 bottom-0 left-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500
      />
      <div
        v-if="message.fileExt && message.category !== 'text'"
        bg-black bg-opacity-60 text-xs font-semibold px-1 absolute rounded left-1 top-1 transform scale-90 select-none
      >
        {{ message.fileExt.toUpperCase() }}
      </div>
    </div>
    <div text-xs line-clamp-2 leading-4 mt-2 select-none>
      {{ message.title }}
    </div>
    <div text-xs text-neutral-500 mt-1 font-600 line-clamp-2 select-none>
      {{ description }}
    </div>
  </div>
</template>
