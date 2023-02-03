<script setup lang="ts">
import { getFinalFilePath } from '~/utils'
import type { MessageModel } from '~~/models/Message'

const props = defineProps<{
  message: MessageModel
}>()
const message = props.message
const filePath = computedAsync(async() => {
  return `atom://${await getFinalFilePath(message.filePath!)}`
})
</script>

<template>
  <div>
    <img :src="filePath" :alt="message.title">
  </div>
</template>
