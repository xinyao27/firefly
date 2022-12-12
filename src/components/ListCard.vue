<script setup lang="ts">
import dayjs from 'dayjs'
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
      overflow-hidden flex items-center justify-center relative rounded-2 border-2 border-style-solid
      :border-color="isSelected ? 'blue-500' : 'transparent'"
      :style="{ width: `${props.size}px`, height: `${props.size}px` }"
    >
      <img
        w-auto h-full max-w-none
        :src="message.thumb" :alt="message.title"
      >
      <div
        v-if="!!message.fileType"
        bg-black bg-opacity-60 text-xs font-semibold px-1 absolute rounded left-1 top-1 transform scale-90 select-none
      >
        {{ message.fileType.toUpperCase() }}
      </div>
    </div>
    <div text-xs line-clamp-2 leading-4 mt-2>
      {{ message.title }}
    </div>
    <div text-xs text-neutral-500 select-none mt-1 font-600>
      {{ description }}
    </div>
  </div>
</template>
