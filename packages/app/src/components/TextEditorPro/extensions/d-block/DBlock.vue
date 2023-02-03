<script setup lang="ts">
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

function handleDeleteBlock() {
  const from = props.getPos()
  const to = from + props.node.nodeSize

  props.editor.commands.deleteRange({
    from,
    to,
  })
}

function handleCreateNodeAfter() {
  const pos = props.getPos() + props.node.nodeSize

  props.editor.commands.insertContentAt(pos, {
    type: 'dBlock',
    content: [{ type: 'paragraph' }],
  })
}
</script>

<template>
  <NodeViewWrapper as="div" class="block">
    <section
      class="flex gap-1 absolute -left-22 top-1/2 -translate-y-1/2"
      aria-label="left-menu"
      :contentEditable="false"
    >
      <button
        class="block-button"
        type="button"
        @click="handleDeleteBlock"
      >
        <i i-ri-delete-bin-line block />
      </button>
      <button
        class="block-button"
        type="button"
        @click="handleCreateNodeAfter"
      >
        <i i-ri-add-line block />
      </button>
      <div
        class="block-button"
        contenteditable="false"
        draggable="true"
        data-drag-handle
      >
        <i i-ri-drag-move-line block />
      </div>
    </section>

    <NodeViewContent class="w-full" />
  </NodeViewWrapper>
</template>

<style scoped lang="sass">
.block
  @apply flex gap-2 w-full relative
  &:hover
    .block-button
      @apply opacity-50
  .block-button
    @apply flex items-center justify-center h-fit p-1 cursor-grab rounded opacity-0 transition hover:bg-neutral-700
</style>
