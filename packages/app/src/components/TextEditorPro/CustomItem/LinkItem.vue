<script setup lang="ts">
import getMetadata from 'metadata-scraper'
import type { MessageModel } from '~~/models/Message'

const props = defineProps<{
  message: MessageModel
}>()
const message = props.message
const metadata = computedAsync(async() => {
  return await getMetadata(message.link!)
})
</script>

<template>
  <NGrid x-gap="12">
    <NGridItem
      flex flex-col justify-between gap-2 p-2
      :span="14"
    >
      <div flex flex-col gap-2>
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
          line-clamp-2 text-neutral text-xs
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
        flex items-center gap-2 text-xs
      >
        <img
          w-4 h-4
          :src="metadata.icon" :alt="metadata.title"
        >
        <div truncate>
          {{ message.link }}
        </div>
      </div>
    </NGridItem>
    <NGridItem :span="10">
      <div h-106px>
        <NSkeleton
          v-if="!metadata"
          h-full
        />
        <img
          v-else
          w-full h-full
          :src="metadata?.image"
          :alt="metadata?.title"
        >
      </div>
    </NGridItem>
  </NGrid>
</template>
