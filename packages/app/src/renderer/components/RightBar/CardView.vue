<script setup lang="ts">
import dayjs from 'dayjs'
import { byteSize } from '@firefly/utils'

const blockStore = useBlockStore()

const lastBlock = computed(() => {
  const blocks = blockStore.blocks
  const lastBlockId = blockStore.selectedBlockIds.at(-1)
  return blocks.find(v => v.id === lastBlockId)
})
const thumb = computedAsync(async () => {
  switch (lastBlock.value?.category) {
    case 'image':
      return `atom://${await $api.getFinalPath(lastBlock.value?.thumb ?? '')}`
    case 'text':
    case 'link':
      return null
    default:
      return '/icons/GenericDocumentIcon.png'
  }
})
const size = computed(() => {
  const s = byteSize(lastBlock.value?.size)
  return s?.text
})
const path = computedAsync(() => $api.getFinalPath(lastBlock.value?.path ?? ''))
function handleOpen(path?: string) {
  if (path)
    $api.shellOpenPath(path)
}
</script>

<template>
  <div w-full flex flex-col items-center gap-8 p-4>
    <template v-if="lastBlock">
      <div v-if="blockStore.selectedBlockIds.length > 1">
        已选择 {{ blockStore.selectedBlockIds.length }} 个文件
      </div>
      <NImage
        v-if="thumb"
        :src="thumb"
        fallback-src="/icons/GenericDocumentIcon.png"
        lazy
        show-toolbar-tooltip
      />
      <NThing w-full>
        <template v-if="lastBlock.title" #header>
          <span text-lg font-semibold uppercase>{{ lastBlock.title }}</span>
        </template>
        <template v-if="lastBlock.category" #description>
          <NTag size="small" :bordered="false">
            {{ lastBlock.category }}
          </NTag>
        </template>
        <NSpace vertical>
          <NTooltip
            v-if="path"
            trigger="hover"
          >
            <template #trigger>
              <a
                block truncate text-true-gray cursor-pointer text-xs hover:underline
                @click="handleOpen(path)"
              >
                <i i-ri-external-link-line inline-block align-top />
                {{ path }}
              </a>
            </template>
            {{ path }}
          </NTooltip>
          <NTooltip
            v-if="lastBlock.link"
            trigger="hover"
          >
            <template #trigger>
              <a
                block truncate text-true-gray cursor-pointer text-xs hover:underline
                @click="handleOpen(lastBlock?.link)"
              >
                <i i-ri-link inline-block align-top />
                {{ lastBlock.link }}
              </a>
            </template>
            {{ lastBlock.link }}
          </NTooltip>
        </NSpace>
      </NThing>
      <NThing
        v-if="lastBlock.content"
        w-full
      >
        <template #header>
          <span text-neutral>摘要</span>
        </template>
        <NEllipsis
          expand-trigger="click"
          line-clamp="8"
          :tooltip="false"
        >
          {{ lastBlock.content }}
        </NEllipsis>
      </NThing>
      <NThing w-full>
        <template #header>
          <span text-neutral>元数据</span>
        </template>
        <NDescriptions
          label-placement="left"
          :column="1"
          separator=" "
        >
          <NDescriptionsItem v-for="(value, key) in lastBlock.metadata" :key="key">
            <template #label>
              <div text-neutral capitalize w-16 inline-block>
                {{ key }}
              </div>
            </template>
            {{ value }}
          </NDescriptionsItem>
          <NDescriptionsItem>
            <template #label>
              <div text-neutral capitalize w-16 inline-block>
                大小
              </div>
            </template>
            {{ size }}
          </NDescriptionsItem>
          <NDescriptionsItem>
            <template #label>
              <div text-neutral capitalize w-16 inline-block>
                后缀名
              </div>
            </template>
            {{ lastBlock.fileExt }}
          </NDescriptionsItem>
          <NDescriptionsItem>
            <template #label>
              <div text-neutral capitalize w-16 inline-block>
                创建于
              </div>
            </template>
            {{ dayjs(lastBlock.createdAt).fromNow() }}
          </NDescriptionsItem>
          <NDescriptionsItem>
            <template #label>
              <div text-neutral capitalize w-16 inline-block>
                更新于
              </div>
            </template>
            {{ dayjs(lastBlock.updatedAt).fromNow() }}
          </NDescriptionsItem>
          <NDescriptionsItem>
            <template #label>
              <div text-neutral capitalize w-16 inline-block>
                来源
              </div>
            </template>
            {{ lastBlock.from }}
          </NDescriptionsItem>
        </NDescriptions>
      </NThing>
    </template>
    <template v-else>
      <NThing w-full>
        <template #header>
          <span text-neutral>全部文件</span>
        </template>
        <NDescriptions
          label-placement="left"
          :column="1"
          separator=" "
        >
          <NDescriptionsItem>
            <template #label>
              <div text-neutral capitalize w-16 inline-block>
                文件
              </div>
            </template>
            {{ blockStore.blocks.length }}
          </NDescriptionsItem>
        </NDescriptions>
      </NThing>
    </template>
  </div>
</template>

<style scope lang="sass">
.n-thing .n-thing-main
  @apply overflow-hidden
</style>
