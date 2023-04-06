<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'
import { computed } from 'vue'

const props = defineProps(nodeViewProps)
const block = computed(() => (typeof props.node.attrs.block === 'string' ? JSON.parse(props.node.attrs.block) : props.node.attrs.block) as BlockModel)
</script>

<template>
  <NodeViewWrapper
    class="border rounded-sm cursor-pointer border-neutral-500 my-1"
  >
    <div class="flex p-2 transition items-center justify-between hover:bg-neutral-500">
      <div class="flex gap-2 items-center select-none pointer-events-none">
        <i class="i-ri-attachment-line" />
        <div class="flex flex-col">
          <div class="flex gap-2 items-center">
            {{ block.title }}
          </div>
          <div class="text-neutral text-xs">
            {{ block.path }}
          </div>
        </div>
      </div>
      <i class="i-ri-external-link-line" />
    </div>
  </NodeViewWrapper>
</template>
