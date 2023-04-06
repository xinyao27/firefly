<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'
import { getSession } from '@firefly/common'
import { computed } from 'vue'
import { computedAsync } from '@vueuse/core'

const props = defineProps(nodeViewProps)
const block = computed(() => (typeof props.node.attrs.block === 'string' ? JSON.parse(props.node.attrs.block) : props.node.attrs.block) as BlockModel)

const path = computedAsync(async () => {
  const session = await getSession()
  return `${block.value.path}?token=${session?.access_token}`
})
</script>

<template>
  <NodeViewWrapper
    class="border rounded-sm cursor-pointer border-neutral-500 my-1"
  >
    <img :src="path" :alt="block.title">
  </NodeViewWrapper>
</template>
