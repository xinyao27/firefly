<script setup lang="ts">
import 'highlight.js/scss/github.scss'
import './style.sass'
import type { Content } from '@tiptap/vue-3'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import BubbleMenu from './BubbleMenu'
import { extensions } from './extensions/starter-kit'

const props = defineProps<{
  value: Content
}>()
const emits = defineEmits<{
  (event: 'update:value', value: string): void
}>()
const { value } = useVModels(props, emits)

const textEditorStore = useTextEditorStore()

const editor = useEditor({
  content: value,
  extensions,
  editorProps: {
    attributes: {
      id: 'text-editor',
      class: 'min-h-32 max-h-60 overflow-auto relative focus:outline-none prose prose-black',
      suppressContentEditableWarning: 'true',
    },
  },
  onUpdate({ editor }) {
    const content = editor.getHTML()
    value.value = content
  },
})

onMounted(() => {
  textEditorStore.editor = editor.value
  editor.value?.commands.focus()
})
</script>

<template>
  <div p-4 pl-6.5 rounded-2>
    <EditorContent
      :editor="editor"
      class="relative"
    />
    <BubbleMenu :editor="editor" />
  </div>
</template>
