<script setup lang="ts">
import 'highlight.js/scss/github.scss'
import './style.sass'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useMediaQuery, useVModel } from '@vueuse/core'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import type { TagModel } from '@firefly/common'
import BubbleMenu from './BubbleMenu'
import { extensions } from './extensions/starter-kit'
import { useTextEditorState } from './state'

const props = withDefaults(defineProps<{
  class?: string
  modelValue: string
  tags: TagModel[]
  onFocus?: () => void
  onBlur?: () => void
  onCreated?: (editor: Editor) => void
  bubbleMenu?: boolean
}>(), {
  bubbleMenu: true,
})
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

const state = useTextEditorState()
const editor = useEditor({
  content: data.value,
  extensions,
  editorProps: {
    attributes: {
      class: 'w-full max-w-full max-h-80 relative text-left transition focus:outline-none',
      suppressContentEditableWarning: 'true',
    },
  },
  onUpdate({ editor }) {
    const content = editor.getHTML()
    data.value = content
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
onBeforeUnmount(() => {
  editor.value?.destroy()
})
watch(() => props.modelValue, (value) => {
  editor.value?.commands.setContent(value)
})
watch(() => props.tags, (tags) => {
  state.tags.value = tags
})
</script>

<template>
  <div
    :ref="state.root"
    @click="editor?.commands.focus()"
  >
    <EditorContent
      :editor="editor"
      class="relative overflow-x-hidden overflow-y-auto cursor-text w-full max-w-full"
      :class="[props.class]"
    />
    <BubbleMenu
      v-if="props.bubbleMenu"
      :editor="editor"
    />
  </div>
</template>