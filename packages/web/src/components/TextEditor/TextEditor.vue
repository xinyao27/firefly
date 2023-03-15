<script setup lang="ts">
import 'highlight.js/scss/github.scss'
import './style.sass'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import BubbleMenu from './BubbleMenu'
import { extensions } from './extensions/starter-kit'

const copilotStore = useCopilotStore()
const configStore = useConfigStore()

const className = ref('w-full max-w-full max-h-80 overflow-auto relative transition focus:outline-none prose prose-black')
const editor = useEditor({
  content: copilotStore.value,
  extensions,
  editorProps: {
    attributes: {
      class: className.value,
      suppressContentEditableWarning: 'true',
    },
  },
  onUpdate({ editor }) {
    const content = editor.getHTML()
    copilotStore.value = content
  },
  onFocus() {
    copilotStore.toggleFocus(true)
  },
  onBlur() {
    copilotStore.toggleFocus(false)
  },
})

watch(() => copilotStore.focus, (focus) => {
  editor.value?.setOptions({
    editorProps: {
      attributes: {
        style: `min-height: ${focus ? 6 : 1.5}rem`,
      },
    },
  })
})
onMounted(() => {
  copilotStore.editor = editor.value!
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
