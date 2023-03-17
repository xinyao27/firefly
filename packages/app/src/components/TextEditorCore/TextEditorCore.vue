<script setup lang="ts">
import 'highlight.js/scss/github.scss'
import './style.sass'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import BubbleMenu from './BubbleMenu'
import { extensions } from './extensions/starter-kit'

const textEditorStore = useTextEditorStore()
const configStore = useConfigStore()

const className = ref('w-full max-w-full max-h-80 overflow-auto relative transition focus:outline-none prose prose-black')
const editor = useEditor({
  content: textEditorStore.value,
  extensions,
  editorProps: {
    attributes: {
      class: className.value,
      suppressContentEditableWarning: 'true',
    },
  },
  onUpdate({ editor }) {
    const content = editor.getHTML()
    textEditorStore.value = content
  },
  onFocus() {
    textEditorStore.toggleFocus(true)
  },
  onBlur() {
    textEditorStore.toggleFocus(false)
  },
})

watch(() => textEditorStore.focus, (focus) => {
  editor.value?.setOptions({
    editorProps: {
      attributes: {
        style: `min-height: ${focus ? 6 : 1.5}rem`,
      },
    },
  })
})
onMounted(() => {
  textEditorStore.editor = editor.value!
  if (!configStore.isMobileScreen) {
    editor.value?.commands.focus()
    editor.value?.commands.selectAll()
  }
})
</script>

<template>
  <div>
    <EditorContent
      :editor="editor"
      class="relative"
    />
    <BubbleMenu :editor="editor" />
  </div>
</template>
