<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import TextBlock from './TextBlock.vue'
import ImageBlock from './ImageBlock.vue'
import LinkBlock from './LinkBlock.vue'
import OtherBlock from './OtherBlock.vue'
import type { MessageModel } from '~~/models/Message'

const props = defineProps(nodeViewProps)
const message = props.node.attrs.message as MessageModel
</script>

<template>
  <NodeViewWrapper
    class="overflow-hidden my-1 border border-neutral-700 rounded cursor-pointer transition hover:bg-neutral-800"
  >
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
  </NodeViewWrapper>
</template>
