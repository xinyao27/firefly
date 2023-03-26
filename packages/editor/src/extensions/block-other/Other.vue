<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'

const props = defineProps(nodeViewProps)
const block = props.node.attrs.block as BlockModel
</script>

<template>
  <NodeViewWrapper
    class="border rounded-sm cursor-pointer border-neutral my-1"
  >
    <div class="flex p-2 transition items-center justify-between hover:bg-neutral-500">
      <div class="flex gap-2 items-center select-none pointer-events-none">
        <i class="text-lg block i-ri-file-3-line" />
        <div class="flex flex-col">
          <div class="flex gap-2 items-center">
            {{ block.title }}
          </div>
          <div class="text-xs">
            {{ block.path }}
          </div>
        </div>
      </div>
    </div>
  </NodeViewWrapper>
</template>
