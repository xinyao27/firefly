<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { MessageModel } from '~~/models/Message'
import { isBase64 } from '~~/utils'

const props = defineProps(nodeViewProps)
const message = props.node.attrs.message as MessageModel

const filePath = computed(() => {
  return isBase64(message.filePath!) ? message.filePath : `atom://${message.filePath}`
})
</script>

<template>
  <NodeViewWrapper
    class="my-1 border border-neutral-700 rounded cursor-pointer"
  >
    <img :src="filePath" :alt="message.title">
  </NodeViewWrapper>
</template>
