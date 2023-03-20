<script setup lang="ts">
import 'highlight.js/scss/github.scss'
import './style.sass'
import { onMounted, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import type { TagModel } from '@firefly/common'
import BubbleMenu from './BubbleMenu'
import { extensions } from './extensions/starter-kit'
import { useTextEditorState } from './state'

const props = defineProps<{
  value: string
  tags: TagModel[]
  onChange: (value: string) => void
  onFocus: () => void
  onBlur: () => void
  onCreated: (editor: Editor) => void
}>()

const state = useTextEditorState()
const className = ref('w-full max-w-full max-h-80 overflow-auto relative transition focus:outline-none prose prose-black')
const editor = useEditor({
  content: props.value,
  extensions,
  editorProps: {
    attributes: {
      class: className.value,
      suppressContentEditableWarning: 'true',
    },
  },
  onUpdate({ editor }) {
    const content = editor.getHTML()
    props.onChange(content)
  },
  onFocus() {
    props.onFocus()
  },
  onBlur() {
    props.onBlur()
  },
})

onMounted(() => {
  props.onCreated(editor.value!)
  const isMobileScreen = useMediaQuery('(max-width: 640px)')

  if (!isMobileScreen) {
    editor.value?.commands.focus()
    editor.value?.commands.selectAll()
  }
})
watch(() => props.tags, (tags) => {
  state.tags.value = tags
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
