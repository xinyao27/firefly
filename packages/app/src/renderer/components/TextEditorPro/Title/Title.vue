<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { useMoreOptions } from './useMoreOptions'

const props = defineProps<{
  editor?: Editor
}>()
const blockStore = useBlockStore()
const { options: moreOptions, handleSelect: handleMoreSelect } = useMoreOptions(props)

const popoverDefaultTitle = ref(blockStore.currentBlock?.title)
function handleTitlePopoverUpdate(show: boolean) {
  if (show) {
    popoverDefaultTitle.value = blockStore.currentBlock?.title
  }
  else {
    if (
      blockStore.currentBlock
    && popoverDefaultTitle.value
    && blockStore.currentBlock.title !== popoverDefaultTitle.value
    ) {
      blockStore.updateArticleTitle(blockStore.currentBlock.id, popoverDefaultTitle.value)
    }
  }
}
</script>

<template>
  <div
    v-if="props.editor"
    h-46px flex items-center justify-between px-4 bg-inherit
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
          {{ blockStore.currentBlock?.title }}
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

    <div flex items-center justify-between gap-2>
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
