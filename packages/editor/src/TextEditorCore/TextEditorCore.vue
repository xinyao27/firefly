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

const props = withDefaults(defineProps<{
  class?: string
  value: string
  tags: TagModel[]
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  onCreated?: (editor: Editor) => void
  bubbleMenu?: boolean
}>(), {
  bubbleMenu: true,
})

const state = useTextEditorState()
const className = ref(`w-full max-w-full max-h-80 overflow-auto relative text-left transition focus:outline-none ${props.class}`)
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
    props.onFocus?.()
  },
  onBlur() {
    props.onBlur?.()
  },
})

onMounted(() => {
  props.onCreated?.(editor.value!)
  const isMobileScreen = useMediaQuery('(max-width: 640px)')

  if (!isMobileScreen) {
    editor.value?.commands.focus()
    editor.value?.commands.selectAll()
  }

  state.tags.value = props.tags
})
watch(() => props.tags, (tags) => {
  state.tags.value = tags
})
</script>

<template>
  <div :ref="state.root">
    <EditorContent
      :editor="editor"
      class="relative"
    />
    <BubbleMenu
      v-if="props.bubbleMenu"
      :editor="editor"
    />
  </div>
</template>
