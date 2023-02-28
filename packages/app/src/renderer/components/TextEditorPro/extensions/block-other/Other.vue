<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { byteSize } from '@firefly/utils'
import type { BlockModel } from '~/models/Block'

const props = defineProps(nodeViewProps)
const block = props.node.attrs.block as BlockModel

const size = computed(() => {
  const s = byteSize(block.size)
  return s?.text
})

async function handleOpen() {
  const path = block.path
  if (path) {
    $api.shellOpenPath(path)
  }
}
</script>

<template>
  <NodeViewWrapper
    class="my-1 border border-neutral-700 rounded cursor-pointer"
  >
    <div class="flex items-center justify-between p-2 transition hover:bg-neutral-800">
      <div class="flex items-center gap-2 select-none pointer-events-none">
        <i class="i-ri-file-3-line block text-lg" />
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            {{ block.title }}
            <div class="text-neutral text-xs">
              {{ size }}
            </div>
          </div>
          <div class="text-neutral text-xs">
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
