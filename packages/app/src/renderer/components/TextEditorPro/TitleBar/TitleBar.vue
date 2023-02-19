<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { useMoreOptions } from './useMoreOptions'

const props = defineProps<{
  editor?: Editor
}>()
const messageStore = useMessageStore()
const { options: moreOptions, handleSelect: handleMoreSelect } = useMoreOptions(props)

const popoverDefaultTitle = ref(messageStore.currentMessage?.title)
function handleTitlePopoverUpdate(show: boolean) {
  if (show) {
    popoverDefaultTitle.value = messageStore.currentMessage?.title
  }
  else {
    if (
      messageStore.currentMessage
    && popoverDefaultTitle.value
    && messageStore.currentMessage.title !== popoverDefaultTitle.value
    ) {
      messageStore.updateArticleTitle(messageStore.currentMessage.id, popoverDefaultTitle.value)
    }
  }
}
function handleIconChange(name: string) {
  if (messageStore.currentMessage) {
    messageStore.updateArticleIcon(messageStore.currentMessage.id, name)
  }
}
</script>

<template>
  <div
    v-if="props.editor"
    h-46px sticky top-0 left-0 z-200 flex items-center justify-between px-4 bg-dark-700
  >
    <NPopover
      :show-arrow="false"
      overlap
      raw
      trigger="click"
      placement="bottom-start"
      :on-update:show="handleTitlePopoverUpdate"
    >
      <template #trigger>
        <NButton
          quaternary
          size="small"
        >
          <Emoji
            :name="messageStore.currentMessage?.thumb"
            :hoverable="false"
          />
          {{ messageStore.currentMessage?.title }}
        </NButton>
      </template>
      <div bg-neutral-700 rounded-2 shadow flex gap-1 p-1>
        <Emoji
          :name="messageStore.currentMessage?.thumb"
          selector
          @select="handleIconChange"
        />
        <NInput
          v-model:value="popoverDefaultTitle"
          size="small"
        />
      </div>
    </NPopover>

    <div flex items-center justify-between>
      <NDropdown
        :options="moreOptions"
        size="small"
        trigger="click"
        @select="handleMoreSelect"
      >
        <NButton
          size="small"
          quaternary
        >
          <i i-ri-more-fill />
        </NButton>
      </NDropdown>
    </div>
  </div>
</template>
