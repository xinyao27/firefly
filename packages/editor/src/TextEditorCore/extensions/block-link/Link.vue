<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'
import { computedAsync } from '@vueuse/core'

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
    class="border rounded cursor-pointer border-neutral-50 my-1"
  >
    <div class="grid transition gap-2 grid-cols-12 overflow-hidden hover:bg-neutral-200">
      <div class="flex flex-col p-4 gap-2 col-span-7 justify-between">
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
            class="text-neutral text-xs line-clamp-2"
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
          class="flex text-xs gap-2 items-center"
        >
          <img
            class="h-4 w-4"
            :src="metadata.icon"
            :alt="metadata.title"
          >
          <div class="truncate">
            {{ block.link }}
          </div>
        </div>
      </div>
      <div class="h-120px col-span-5">
        <NSkeleton
          v-if="!metadata"
          h-full
        />
        <img
          v-else
          class="h-full w-full"
          :src="metadata?.image"
          :alt="metadata?.title"
        >
      </div>
    </div>
  </NodeViewWrapper>
</template>
