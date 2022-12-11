<script setup lang="ts">
import dayjs from 'dayjs'
import type { Message } from '~/models/Message'
import { byteSize } from '~/utils'

const props = defineProps<{
  size: number
  message: Message
}>()
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
</script>

<template>
  <div
    inline-flex flex-col text-center
    :style="{ width: `${props.size}px` }"
  >
    <div
      rounded-1 overflow-hidden flex items-center justify-center relative
      :style="{ width: `${props.size}px`, height: `${props.size}px` }"
    >
      <img
        w-auto h-full max-w-none
        :src="message.thumb" :alt="message.title"
      >
      <div
        v-if="!!message.fileType"
        bg-black bg-opacity-60 text-white text-xs font-semibold px-1 absolute left-1 top-1 rounded transform scale-90
      >
        {{ message.fileType.toUpperCase() }}
      </div>
    </div>
    <div text-xs line-clamp-2 leading-4 mt-2>
      {{ message.title }}
    </div>
    <div text-xs text-neutral-500 select-none mt-1>
      {{ description }}
    </div>
  </div>
</template>
