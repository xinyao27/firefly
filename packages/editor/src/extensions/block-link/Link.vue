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
    const data = await edgeFunctions(`metadata?url=${link}`, {
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
    class="border rounded-sm cursor-pointer border-neutral-500 my-1"
  >
    <a
      class="grid transition gap-2 grid-cols-12 overflow-hidden hover:bg-neutral-500 no-underline"
      :href="block?.link"
      target="_blank"
    >
      <div class="flex flex-col p-4 gap-2 col-span-7 justify-between">
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
            class="text-neutral text-xs line-clamp-2"
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
          class="flex text-xs items-center"
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
          :src="metadata?.image || metadata?.['og:image'] || metadata?.['twitter:image'] || 'https://via.placeholder.com/300x300.png?text=No+Image'"
          :alt="metadata?.['twitter:image:alt'] || metadata?.title || metadata?.['og:title'] || metadata?.['twitter:title']"
        >
      </div>
    </a>
  </NodeViewWrapper>
</template>
