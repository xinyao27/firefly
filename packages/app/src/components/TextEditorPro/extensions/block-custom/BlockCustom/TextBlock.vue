<script setup lang="ts">
import type { MessageModel } from '~~/models/Message'

const props = defineProps<{
  message: MessageModel
}>()
const message = props.message
</script>

<template>
  <div>
    {{ message.content }}
  </div>
</template>
