<script setup lang="ts">
import dayjs from 'dayjs'
import { shell } from 'electron'
import { byteSize } from '~~/utils'
import { getFinalFilePath } from '~/utils'

const messageStore = useMessageStore()

const lastMessage = computed(() => {
  const messages = messageStore.messages
  const lastMessageId = messageStore.selectedMessageIds.at(-1)
  return messages.find(v => v.id === lastMessageId)
})
const thumb = computedAsync(async() => {
  switch (lastMessage.value?.category) {
    case 'image':
      return `atom://${await getFinalFilePath(lastMessage.value?.thumb ?? '')}`
    case 'text':
    case 'link':
      return null
    default:
      return '/icons/GenericDocumentIcon.png'
  }
})
const size = computed(() => {
  const s = byteSize(lastMessage.value?.size)
  return s?.text
})
const filePath = computedAsync(() => getFinalFilePath(lastMessage.value?.filePath ?? ''))
function handleOpen(path?: string) {
  if (path) {
    shell.openPath(path)
  }
}
</script>

<template>
  <aside min-h-full flex flex-col items-center justify-between p-4 bg-neutral-800>
    <div w-full flex flex-col items-center gap-8>
      <template v-if="lastMessage">
        <div v-if="messageStore.selectedMessageIds.length > 1">
          已选择 {{ messageStore.selectedMessageIds.length }} 个文件
        </div>
        <NImage
          v-if="thumb"
          :src="thumb"
          fallback-src="/icons/GenericDocumentIcon.png"
          lazy
          show-toolbar-tooltip
        />
        <NThing w-full>
          <template v-if="lastMessage.title" #header>
            <span text-lg font-semibold uppercase>{{ lastMessage.title }}</span>
          </template>
          <template v-if="lastMessage.category" #description>
            <NTag size="small" :bordered="false">
              {{ lastMessage.category }}
            </NTag>
          </template>
          <NSpace vertical>
            <NTooltip
              v-if="filePath"
              trigger="hover"
            >
              <template #trigger>
                <a
                  block truncate text-true-gray cursor-pointer text-xs hover:underline
                  @click="handleOpen(filePath)"
                >
                  <i i-ri-external-link-line inline-block align-top />
                  {{ filePath }}
                </a>
              </template>
              {{ filePath }}
            </NTooltip>
            <NTooltip
              v-if="lastMessage.link"
              trigger="hover"
            >
              <template #trigger>
                <a
                  block truncate text-true-gray cursor-pointer text-xs hover:underline
                  @click="handleOpen(lastMessage?.link)"
                >
                  <i i-ri-link inline-block align-top />
                  {{ lastMessage.link }}
                </a>
              </template>
              {{ lastMessage.link }}
            </NTooltip>
          </NSpace>
        </NThing>
        <NThing
          v-if="lastMessage.content"
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
            {{ lastMessage.content }}
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
            <NDescriptionsItem v-for="(value, key) in lastMessage.metadata" :key="key">
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
              {{ lastMessage.fileExt }}
            </NDescriptionsItem>
            <NDescriptionsItem>
              <template #label>
                <div text-neutral capitalize w-16 inline-block>
                  创建于
                </div>
              </template>
              {{ dayjs(lastMessage.createdAt).fromNow() }}
            </NDescriptionsItem>
            <NDescriptionsItem>
              <template #label>
                <div text-neutral capitalize w-16 inline-block>
                  更新于
                </div>
              </template>
              {{ dayjs(lastMessage.updatedAt).fromNow() }}
            </NDescriptionsItem>
            <NDescriptionsItem>
              <template #label>
                <div text-neutral capitalize w-16 inline-block>
                  来源
                </div>
              </template>
              {{ lastMessage.from }}
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
              {{ messageStore.messages.length }}
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
