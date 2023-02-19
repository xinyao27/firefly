<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { MessageModel } from '~/models/Message'

const props = defineProps(nodeViewProps)
const message = props.node.attrs.message as MessageModel
</script>

<template>
  <NodeViewWrapper
    class="my-1 border border-neutral-700 rounded cursor-pointer"
  >
    <div
      class="whitespace-pre-line p-2 transition hover:bg-neutral-800"
      contenteditable="true"
    >
      {{ message.content }}
    </div>
  </NodeViewWrapper>
</template>
