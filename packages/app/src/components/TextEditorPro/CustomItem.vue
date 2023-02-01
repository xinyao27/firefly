<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { shell } from 'electron'
import { byteSize } from '~~/utils'

const props = defineProps(nodeViewProps)
const from = props.node.attrs.from
const message = props.node.attrs.message

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
    <div
      v-if="from === 'message'"
      flex items-center gap-2 select-none pointer-events-none
      class
    >
      <i i-ri-file-3-line block text-lg class="handle" />
      <div flex flex-col>
        <div flex items-center gap-2>
          {{ message.title }}
          <div text-neutral text-xs>
            {{ message.size }}
          </div>
        </div>
        <div text-neutral text-xs>
          {{ message.content }}
        </div>
      </div>
    </div>
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
    <div>
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
  @apply flex items-center justify-between p-2 rounded cursor-pointer transition hover:bg-neutral-700
  &::before
    content: none !important
</style>
