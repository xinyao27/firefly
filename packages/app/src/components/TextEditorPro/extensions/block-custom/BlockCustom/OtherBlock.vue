<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'
import { shell } from 'electron'
import type { MessageModel } from '~~/models/Message'
import { byteSize } from '~~/utils'

const props = defineProps<{
  message: MessageModel
}>()
const message = props.message

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
  <NodeViewWrapper>
    <div flex items-center justify-between p-2 rounded cursor-pointer transition hover:bg-neutral-800>
      <div
        flex items-center gap-2 select-none pointer-events-none
      >
        <i i-ri-file-3-line block text-lg />
        <div flex flex-col>
          <div flex items-center gap-2>
            {{ message.title }}
            <div text-neutral text-xs>
              {{ size }}
            </div>
          </div>
          <div text-neutral text-xs>
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
