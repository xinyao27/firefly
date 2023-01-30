<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { shell } from 'electron'
import { byteSize } from '~~/utils'

const props = defineProps(nodeViewProps)
const size = computed(() => {
  const s = byteSize(props.node.attrs?.size)
  return `${s?.number} ${s?.unit}`
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
    <div flex items-center gap-2 select-none pointer-events-none>
      <i i-ri-file-3-line block text-lg />
      <div flex flex-col>
        <div flex items-center gap-2>
          {{ props.node.attrs?.name }}
          <div text-trueGray text-xs>
            {{ size }}
          </div>
        </div>
        <div text-trueGray text-xs>
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
