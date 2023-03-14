<script setup lang="ts">
import 'highlight.js/scss/github.scss'
import './style.sass'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import BubbleMenu from './BubbleMenu'
import { extensions } from './extensions/starter-kit'

const copilotStore = useCopilotStore()

const editor = useEditor({
  content: copilotStore.value,
  extensions,
  editorProps: {
    attributes: {
      class: 'w-full max-w-full min-h-18 max-h-60 overflow-auto relative focus:outline-none prose prose-black',
      suppressContentEditableWarning: 'true',
    },
  },
  onUpdate({ editor }) {
    const content = editor.getHTML()
    copilotStore.value = content
  },
})

onMounted(() => {
  editor.value?.commands.focus()
  editor.value?.commands.selectAll()
})
</script>

<template>
  <div p-4 pl-6.5 rounded-2 bg-neutral-50 transition>
    <EditorContent
      :editor="editor"
      class="relative"
    />
    <BubbleMenu :editor="editor" />
  </div>
</template>
