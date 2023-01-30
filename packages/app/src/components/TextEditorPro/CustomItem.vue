<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { byteSize } from '~~/utils'

const props = defineProps(nodeViewProps)
const size = computed(() => {
  const s = byteSize(props.node.attrs?.size)
  return `${s?.number} ${s?.unit}`
})
</script>

<template>
  <NodeViewWrapper class="wrapper">
    <div flex items-center gap-2>
      <i i-ri-file-3-line block text-lg />
      <div flex flex-col>
        <span select-none pointer-events-none>{{ props.node.attrs?.name }}</span>
        <span text-trueGray text-xs>{{ props.node.attrs?.path }}</span>
      </div>
    </div>
    <div text-trueGray>
      {{ size }}
    </div>
  </NodeViewWrapper>
</template>

<style scoped lang="sass">
.wrapper
  @apply flex items-center justify-between p-2 rounded cursor-pointer transition hover:bg-neutral-700
  &::before
    content: none !important
</style>
