<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { useMoreOptions } from './useMoreOptions'

const props = defineProps<{
  editor?: Editor
}>()
const articleStore = useArticleStore()
const { options: moreOptions, handleSelect: handleMoreSelect } = useMoreOptions(props)

const popoverDefaultTitle = ref(articleStore.currentArticle?.title)
function handleTitlePopoverUpdate(show: boolean) {
  if (show) {
    popoverDefaultTitle.value = articleStore.currentArticle?.title
  }
  else {
    if (
      articleStore.currentArticle
    && popoverDefaultTitle.value
    && articleStore.currentArticle.title !== popoverDefaultTitle.value
    ) {
      articleStore.updateTitle(articleStore.currentArticle.id, popoverDefaultTitle.value)
    }
  }
}
</script>

<template>
  <div
    v-if="props.editor"
    h-46px sticky top-0 left-0 z-100 flex items-center justify-between px-4 bg-dark-700
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
          {{ articleStore.currentArticle?.title }}
        </NButton>
      </template>
      <div bg-neutral-700 rounded-2 shadow flex gap-1 p-1>
        <Emoji selector />
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
