<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { shell } from 'electron'
import type { MessageModel } from '~~/models/Message'
import { byteSize } from '~~/utils'

const props = defineProps(nodeViewProps)
const message = props.node.attrs.message as MessageModel

const size = computed(() => {
  const s = byteSize(message.size)
  return s?.text
})

async function handleOpen() {
  const path = message.filePath
  if (path) {
    shell.openPath(path)
  }
}
</script>

<template>
  <NodeViewWrapper
    class="overflow-hidden my-1 border border-neutral-700 rounded cursor-pointer transition hover:bg-neutral-800"
  >
    <div class="flex items-center justify-between p-2">
      <div class="flex items-center gap-2 select-none pointer-events-none">
        <i class="i-ri-file-3-line block text-lg" />
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            {{ message.title }}
            <div class="text-neutral text-xs">
              {{ size }}
            </div>
          </div>
          <div class="text-neutral text-xs">
            {{ message.filePath }}
          </div>
        </div>
      </div>
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
