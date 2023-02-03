<script setup lang="ts">
import { nodeViewProps } from '@tiptap/vue-3'
import TextBlock from './TextBlock.vue'
import ImageBlock from './ImageBlock.vue'
import LinkBlock from './LinkBlock.vue'
import OtherBlock from './OtherBlock.vue'
import type { MessageModel } from '~~/models/Message'

const props = defineProps(nodeViewProps)
const message = props.node.attrs.message as MessageModel
</script>

<template>
  <TextBlock
    v-if="message.category === 'text'"
    :message="message"
  />
  <ImageBlock
    v-else-if="message.category === 'image'"
    :message="message"
  />
  <LinkBlock
    v-else-if="message.category === 'link'"
    :message="message"
  />
  <OtherBlock
    v-else-if="message.category === 'other'"
    :message="message"
  />
</template>
