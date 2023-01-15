<script setup lang="ts">
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
</script>

<template>
  <NodeViewWrapper class="draggable-item">
    <div
      class="drag-indicator"
      contenteditable="false"
      draggable="true"
      data-drag-handle
    >
      <i i-tabler-grip-vertical w-full h-full block />
    </div>
    <NodeViewContent />
  </NodeViewWrapper>
</template>

<style lang="sass">
.draggable-item
  @apply relative

  .drag-indicator
    @apply absolute text-gray bg-transparent rounded cursor-grab transition opacity-0 hover:(bg-gray bg-opacity-10)
    width: 18px
    height: 18px
    top: 4px
    left: -24px

  &:hover
    .drag-indicator
      @apply opacity-80
</style>
