
<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import TipTapStarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
  extensions: [TipTapStarterKit],
})
</script>

<template>
  <EditorContent :editor="editor" />
</template>
