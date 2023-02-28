<script setup lang="ts">
import dayjs from 'dayjs'
import { byteSize } from '@firefly/utils'

const blockStore = useBlockStore()

const thumb = computedAsync(async () => {
  switch (blockStore.currentBlock?.category) {
    case 'image':
      return `atom://${await $api.getFinalPath(blockStore.currentBlock?.thumb ?? '')}`
    case 'text':
    case 'link':
      return null
    default:
      return '/icons/GenericDocumentIcon.png'
  }
})
const size = computed(() => {
  const s = byteSize(blockStore.currentBlock?.size)
  return s?.text
})
const path = computedAsync(() => $api.getFinalPath(blockStore.currentBlock?.path ?? ''))
function handleOpen(path?: string) {
  if (path)
    $api.shellOpenPath(path)
}
</script>

<template>
  <aside min-h-full flex flex-col items-center justify-between bg-neutral-800>
    <div w-full flex flex-col items-center gap-8 p-4>
      <template v-if="blockStore.currentBlock">
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
          <template v-if="blockStore.currentBlock.title" #header>
            <span text-lg font-semibold uppercase>{{ blockStore.currentBlock.title }}</span>
          </template>
          <template v-if="blockStore.currentBlock.category" #description>
            <NTag size="small" :bordered="false">
              {{ blockStore.currentBlock.category }}
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
              v-if="blockStore.currentBlock.link"
              trigger="hover"
            >
              <template #trigger>
                <a
                  block truncate text-true-gray cursor-pointer text-xs hover:underline
                  @click="handleOpen(blockStore.currentBlock?.link)"
                >
                  <i i-ri-link inline-block align-top />
                  {{ blockStore.currentBlock.link }}
                </a>
              </template>
              {{ blockStore.currentBlock.link }}
            </NTooltip>
          </NSpace>
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
            <NDescriptionsItem v-for="(value, key) in blockStore.currentBlock.metadata" :key="key">
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
              {{ blockStore.currentBlock.fileExt }}
            </NDescriptionsItem>
            <NDescriptionsItem>
              <template #label>
                <div text-neutral capitalize w-16 inline-block>
                  创建于
                </div>
              </template>
              {{ dayjs(blockStore.currentBlock.createdAt).fromNow() }}
            </NDescriptionsItem>
            <NDescriptionsItem>
              <template #label>
                <div text-neutral capitalize w-16 inline-block>
                  更新于
                </div>
              </template>
              {{ dayjs(blockStore.currentBlock.updatedAt).fromNow() }}
            </NDescriptionsItem>
            <NDescriptionsItem>
              <template #label>
                <div text-neutral capitalize w-16 inline-block>
                  来源
                </div>
              </template>
              {{ blockStore.currentBlock.from }}
            </NDescriptionsItem>
          </NDescriptions>
        </NThing>
      </template>
    </div>
  </aside>
</template>

<style scope lang="sass">
.n-thing .n-thing-main
  @apply overflow-hidden
</style>
