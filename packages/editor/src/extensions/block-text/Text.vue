<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'
import { computed } from 'vue'

const props = defineProps(nodeViewProps)
const block = computed(() => (typeof props.node.attrs.block === 'string' ? JSON.parse(props.node.attrs.block) : props.node.attrs.block) as BlockModel)
</script>

<template>
  <NodeViewWrapper
    class="my-1 border border-neutral-500 rounded-sm cursor-pointer"
  >
    <div
      class="whitespace-pre-line p-2 transition hover:bg-neutral-500"
    >
      {{ block.content }}
    </div>
  </NodeViewWrapper>
</template>
