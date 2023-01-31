<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor?: Editor
}>()
</script>

<template>
  <div
    v-if="props.editor"
    bg-dark-400 border-dark-200 border px-2 py-1 absolute right-0 bottom-0 text-xs flex gap-2 select-none
    style="border-top-left-radius: 0.5rem"
  >
    <span>
      {{ props.editor.storage.characterCount.words() }} 个词
    </span>
    <span>
      {{ props.editor.storage.characterCount.characters() }} 个字符
    </span>
  </div>
</template>
