<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { useMoreOptions } from './useMoreOptions'
const props = defineProps<{
  editor?: Editor
}>()
const textEditorStore = useTextEditorStore()
const { options: moreOptions, handleSelect: handleMoreSelect } = useMoreOptions(props)
</script>

<template>
  <div
    v-if="props.editor"
    h-46px sticky top-0 left-0 z-100 flex items-center justify-between px-4 bg-dark-700
  >
    <div>{{ textEditorStore.currentArticleId }}</div>

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
