<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { isBase64 } from '@firefly/utils'
import type { MessageModel } from '~/models/Message'

const props = defineProps(nodeViewProps)
const message = props.node.attrs.message as MessageModel

const path = computed(() => {
  return isBase64(message.path!) ? message.path : `atom://${message.path}`
})
</script>

<template>
  <NodeViewWrapper
    class="my-1 border border-neutral-700 rounded cursor-pointer"
  >
    <img :src="path" :alt="message.title">
  </NodeViewWrapper>
</template>
