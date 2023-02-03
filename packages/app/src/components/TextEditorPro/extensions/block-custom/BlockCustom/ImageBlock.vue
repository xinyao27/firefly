<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'
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
  <NodeViewWrapper>
    <div p-2 rounded cursor-pointer transition hover:bg-neutral-800>
      <img :src="filePath" :alt="message.title">
    </div>
  </NodeViewWrapper>
</template>
