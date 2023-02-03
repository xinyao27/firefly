<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { shell } from 'electron'
import TextItem from './TextBlock.vue'
import ImageItem from './ImageBlock.vue'
import LinkItem from './LinkBlock.vue'
import type { MessageModel } from '~~/models/Message'
import { byteSize } from '~~/utils'

const props = defineProps(nodeViewProps)
const from = props.node.attrs.from
const message = props.node.attrs.message as MessageModel

const size = computed(() => {
  const s = byteSize(props.node.attrs?.size)
  return s?.text
})

async function handleOpen() {
  const path = props.node.attrs.path
  if (path) {
    shell.openPath(path)
  }
}
</script>

<template>
  <NodeViewWrapper class="wrapper">
    <template v-if="from === 'message'">
      <TextItem
        v-if="message.category === 'text'"
        :message="message"
      />
      <ImageItem
        v-else-if="message.category === 'image'"
        :message="message"
      />
      <LinkItem
        v-else-if="message.category === 'link'"
        :message="message"
      />
    </template>

    <div
      v-if="from === 'file'"
      flex items-center gap-2 select-none pointer-events-none
    >
      <i i-ri-file-3-line block text-lg />
      <div flex flex-col>
        <div flex items-center gap-2>
          {{ props.node.attrs?.name }}
          <div text-neutral text-xs>
            {{ size }}
          </div>
        </div>
        <div text-neutral text-xs>
          {{ props.node.attrs?.path }}
        </div>
      </div>
    </div>
    <div v-if="from === 'file'">
      <NButton
        size="tiny"
        quaternary
        @click="handleOpen"
      >
        <i i-ri-external-link-line />
      </NButton>
    </div>
  </NodeViewWrapper>
</template>

<style scoped lang="sass">
.wrapper
  @apply flex items-center justify-between p-2 rounded cursor-pointer transition hover:bg-neutral-800
  &::before
    content: none !important
</style>
