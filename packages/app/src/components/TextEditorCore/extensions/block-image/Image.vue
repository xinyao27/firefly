<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { isBase64 } from '@firefly/common'
import type { BlockModel } from '@firefly/common'

const props = defineProps(nodeViewProps)
const block = props.node.attrs.block as BlockModel

const path = computed(() => {
  return isBase64(block.path!) ? block.path : `atom://${block.path}`
})
</script>

<template>
  <NodeViewWrapper
    class="my-1 border border-neutral-700 rounded cursor-pointer"
  >
    <img :src="path" :alt="block.title">
  </NodeViewWrapper>
</template>
