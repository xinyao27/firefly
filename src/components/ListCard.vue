<script setup lang="ts">
import dayjs from 'dayjs'
import type { Message } from '~/models/Message'
import { byteSize } from '~/utils'

const props = defineProps<{
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
  <div w-200px inline-flex flex-col text-center>
    <div w-full h-200px rounded-1 select-none overflow-hidden flex items-center justify-center relative>
      <img
        w-auto h-full max-w-none
        :src="message.thumb" :alt="message.title"
      >
      <div
        v-if="!!message.fileType"
        bg-black bg-opacity-60 text-white text-xs font-semibold px-1 absolute left-1 top-1 rounded
      >
        {{ message.fileType.toUpperCase() }}
      </div>
    </div>
    <div text-sm line-clamp-2 leading-4 mt-2>
      {{ message.title }}
    </div>
    <div text-xs text-neutral-500 select-none mt-1>
      {{ description }}
    </div>
  </div>
</template>
