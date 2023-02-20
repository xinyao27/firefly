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
</script>

<template>
  <div
    v-if="props.editor"
    h-46px sticky top-0 left-0 z-200 flex items-center justify-between px-4 bg-dark-800
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
          {{ messageStore.currentMessage?.title }}
        </NButton>
      </template>
      <div bg-neutral-700 rounded-2 shadow px-2 py-1>
        <NInput
          v-model:value="popoverDefaultTitle"
          class="!w-36 ml-1"
          size="small"
          autofocus
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
