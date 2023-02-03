<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { MessageModel } from '~~/models/Message'

const props = defineProps<{
  message: MessageModel
}>()
const message = props.message
</script>

<template>
  <NodeViewWrapper>
    <div
      whitespace-pre-line p-2 rounded cursor-pointer transition hover:bg-neutral-800
      contenteditable="true"
    >
      {{ message.content }}
    </div>
  </NodeViewWrapper>
</template>
