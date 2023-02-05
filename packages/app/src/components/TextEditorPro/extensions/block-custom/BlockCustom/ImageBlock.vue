<script setup lang="ts">
import { getFinalFilePath } from '~/utils'
import type { MessageModel } from '~~/models/Message'

const props = defineProps<{
  message: MessageModel
}>()
const message = props.message
function isBase64(str: string) {
  if (str.includes('data:') && str.includes('base64')) {
    return true
  }
  else {
    return false
  }
}
const filePath = computedAsync(async() => {
  return isBase64(message.filePath!) ? message.filePath : `atom://${await getFinalFilePath(message.filePath!)}`
})
</script>

<template>
  <img :src="filePath" :alt="message.title">
</template>
