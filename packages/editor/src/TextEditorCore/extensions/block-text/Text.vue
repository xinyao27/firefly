<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'

const props = defineProps(nodeViewProps)
const block = props.node.attrs.block as BlockModel
</script>

<template>
  <NodeViewWrapper
    class="my-1 border border-neutral-700 rounded cursor-pointer"
  >
    <div
      class="whitespace-pre-line p-2 transition hover:bg-neutral-800"
      contenteditable="true"
    >
      {{ block.content }}
    </div>
  </NodeViewWrapper>
</template>
