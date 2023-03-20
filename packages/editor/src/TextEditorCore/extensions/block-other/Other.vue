<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'

const props = defineProps(nodeViewProps)
const block = props.node.attrs.block as BlockModel

async function handleOpen() {
  const path = block.path
  if (path)
    console.warn(path)
}
</script>

<template>
  <NodeViewWrapper
    class="border rounded cursor-pointer border-neutral-200 my-1"
  >
    <div class="flex p-2 transition items-center justify-between hover:bg-neutral-200">
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
      <NButton
        size="tiny"
        quaternary
        @click="handleOpen"
      >
        <i i-ri-external-link-line />
      </NButton>
    </div>
  </NodeViewWrapper>
</template>
