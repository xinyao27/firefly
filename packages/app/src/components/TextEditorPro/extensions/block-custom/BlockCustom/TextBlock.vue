<script setup lang="ts">
import type { MessageModel } from '~~/models/Message'

const props = defineProps<{
  message: MessageModel
}>()
const message = props.message
</script>

<template>
  <div
    whitespace-pre-line p-2
    contenteditable="true"
  >
    {{ message.content }}
  </div>
</template>
