<script setup lang="ts">
import 'highlight.js/scss/github.scss'
import './style.sass'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { previewExtensions } from './extensions/starter-kit'

const props = defineProps<{
  value: string
}>()
const editor = useEditor({
  content: props.value,
  extensions: previewExtensions,
  editorProps: {
    attributes: {
      class: 'relative focus:outline-none prose prose-black',
    },
  },
  editable: false,
})
</script>

<template>
  <EditorContent
    :editor="editor"
    class="relative"
  />
</template>
