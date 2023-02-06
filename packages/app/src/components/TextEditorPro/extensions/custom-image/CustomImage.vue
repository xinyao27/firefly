<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { MessageModel } from '~~/models/Message'

const props = defineProps(nodeViewProps)
const message = props.node.attrs.message as MessageModel

function isBase64(str: string) {
  if (str.includes('data:') && str.includes('base64')) {
    return true
  }
  else {
    return false
  }
}
const filePath = computed(() => {
  return isBase64(message.filePath!) ? message.filePath : `atom://${message.filePath}`
})
</script>

<template>
  <NodeViewWrapper
    class="overflow-hidden my-1 border border-neutral-700 rounded cursor-pointer transition hover:bg-neutral-800"
  >
    <img :src="filePath" :alt="message.title">
  </NodeViewWrapper>
</template>
