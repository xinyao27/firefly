<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'

const props = defineProps(nodeViewProps)
const block = props.node.attrs.block as BlockModel

async function getWebsiteMetadata(link: string) {
  // TODO
  console.warn(link)
}

const metadata = computedAsync(async () => {
  return props.node.attrs.metadata || await getWebsiteMetadata(block.link!)
})
</script>

<template>
  <NodeViewWrapper
    class="my-1 border border-neutral-50 rounded cursor-pointer"
  >
    <div class="overflow-hidden grid grid-cols-12 gap-2 transition hover:bg-neutral-200">
      <div class="flex flex-col justify-between gap-2 p-4 col-span-7">
        <div class="flex flex-col gap-2">
          <NSkeleton
            v-if="!metadata"
            text
          />
          <div v-else>
            {{ metadata?.title }}
          </div>
          <NSkeleton
            v-if="!metadata"
            text
          />
          <NSkeleton
            v-if="!metadata"
            text
            style="width: 60%"
          />
          <div
            v-else
            class="line-clamp-2 text-neutral text-xs"
          >
            {{ metadata?.description }}
          </div>
        </div>

        <NSkeleton
          v-if="!metadata"
          text
          style="width: 60%"
        />
        <div
          v-else
          class="flex items-center gap-2 text-xs"
        >
          <img
            class="w-4 h-4"
            :src="metadata.icon"
            :alt="metadata.title"
          >
          <div class="truncate">
            {{ block.link }}
          </div>
        </div>
      </div>
      <div class="col-span-5 h-120px">
        <NSkeleton
          v-if="!metadata"
          h-full
        />
        <img
          v-else
          class="w-full h-full"
          :src="metadata?.image"
          :alt="metadata?.title"
        >
      </div>
    </div>
  </NodeViewWrapper>
</template>
