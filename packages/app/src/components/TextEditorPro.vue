
<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import TipTapStarterKit from '@tiptap/starter-kit'

const configStore = useConfigStore()

const editor = useEditor({
  content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
  extensions: [TipTapStarterKit],
  editorProps: {
    attributes: {
      class: 'min-h-full prose mx-auto my-5 focus:outline-none',
      style: 'min-height: 100%',
    },
  },
})
</script>

<template>
  <EditorContent
    :style="`height: calc(100vh - ${configStore.rootPaddingTop}px)`"
    :editor="editor"
  />
</template>
