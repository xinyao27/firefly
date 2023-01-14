<script setup lang="ts">
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
</script>

<template>
  <NodeViewWrapper class="draggable-item">
    <i
      class="drag-handle"
      contenteditable="false"
      draggable="true"
      data-drag-handle
    />
    <NodeViewContent />
  </NodeViewWrapper>
</template>

<style lang="sass">
.draggable-item
  @apply relative

  .drag-handle
    @apply i-ri-drag-move-2-fill w-4 h-4 absolute -left-6 text-gray cursor-move transition opacity-0

  &:hover
    .drag-handle
      @apply opacity-100
</style>
