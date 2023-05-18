<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'
import { edgeFunctions } from '@firefly/common'
import { computedAsync } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps(nodeViewProps)
const block = computed(() => (typeof props.node.attrs.block === 'string' ? JSON.parse(props.node.attrs.block) : props.node.attrs.block) as BlockModel)

async function getWebsiteMetadata(link: string) {
  try {
    const data = await edgeFunctions(`metadata?url=${encodeURIComponent(link)}`, {
      method: 'GET',
    })

    props.updateAttributes({
      block: {
        ...block.value,
        metadata: data,
      },
    })
    return data.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

const metadata = computedAsync(async () => {
  return block.value.metadata || await getWebsiteMetadata(block.value.link!)
})
</script>

<template>
  <NodeViewWrapper
    class="my-1 cursor-pointer border border-neutral-500 rounded-sm"
  >
    <a
      class="grid grid-cols-12 gap-2 overflow-hidden no-underline transition hover:bg-neutral-500"
      :href="block?.link"
      target="_blank"
    >
      <div class="col-span-7 flex flex-col justify-between gap-2 p-4">
        <div class="flex flex-col gap-2">
          <NSkeleton
            v-if="!metadata"
            text
          />
          <div
            v-else
            truncate
          >
            {{ metadata?.title || metadata?.['og:title'] || metadata?.['twitter:title'] }}
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
            class="line-clamp-2 text-xs text-neutral"
          >
            {{ metadata?.description || metadata?.['og:description'] }}
          </div>
        </div>

        <NSkeleton
          v-if="!metadata"
          text
          style="width: 60%"
        />
        <div
          v-else
          class="flex items-center text-xs"
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
          class="h-full w-full"
          :src="metadata?.image || metadata?.['og:image'] || metadata?.['twitter:image'] || 'https://via.placeholder.com/300x300.png?text=No+Image'"
          :alt="metadata?.['twitter:image:alt'] || metadata?.title || metadata?.['og:title'] || metadata?.['twitter:title']"
        >
      </div>
    </a>
  </NodeViewWrapper>
</template>
