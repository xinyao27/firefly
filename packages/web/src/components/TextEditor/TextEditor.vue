<script setup lang="ts">
import 'highlight.js/scss/github.scss'
import './style.sass'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import BubbleMenu from './BubbleMenu'
import { extensions } from './extensions/starter-kit'

const copilotStore = useCopilotStore()
const configStore = useConfigStore()

const className = ref('w-full max-w-full max-h-80 overflow-auto relative focus:outline-none prose prose-black')
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
  onFocus({ editor }) {
    editor.setOptions({
      editorProps: {
        attributes: {
          style: 'min-height: 6rem',
        },
      },
    })
  },
  onBlur({ editor }) {
    editor.setOptions({
      editorProps: {
        attributes: {
          style: 'min-height: 1.5rem',
        },
      },
    })
  },
})

onMounted(() => {
  if (!configStore.isMobileScreen) {
    editor.value?.commands.focus()
    editor.value?.commands.selectAll()
  }
})
watch(() => copilotStore.value, (value) => {
  editor.value?.commands.setContent(value)
})
</script>

<template>
  <div p-4 rounded-2 bg-neutral-50 transition>
    <EditorContent
      :editor="editor"
      class="relative"
    />
    <BubbleMenu :editor="editor" />
  </div>
</template>
