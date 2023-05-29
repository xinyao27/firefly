<script setup lang="ts">
import 'highlight.js/scss/github-dark.scss'
import './style.sass'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import type { TagWithChildren } from '@firefly/common'
import BubbleMenu from './BubbleMenu'
import { extensions } from './extensions/starter-kit'
import { useTextEditorState } from './state'

const props = withDefaults(defineProps<{
  class?: string
  tags: TagWithChildren[]
  onCreated?: (editor: Editor) => void
  bubbleMenu?: boolean
}>(), {
  bubbleMenu: true,
})
const { modelValue } = defineModels<{
  modelValue: string
}>()
const emitAfterOnUpdate = ref(false)

const state = useTextEditorState()
const editor = useEditor({
  content: modelValue.value,
  autofocus: true,
  extensions,
  editorProps: {
    attributes: {
      class: 'w-full max-w-full min-h-20 h-full relative text-left transition focus:outline-none',
      suppressContentEditableWarning: 'true',
    },
  },
  onUpdate({ editor }) {
    emitAfterOnUpdate.value = true
    const content = editor.getHTML()
    modelValue.value = content
  },
})

onMounted(() => {
  props.onCreated?.(editor.value!)
  state.tags.value = props.tags
})
onBeforeUnmount(() => {
  editor.value?.destroy()
})
watch(modelValue, (value) => {
  if (emitAfterOnUpdate.value) {
    emitAfterOnUpdate.value = false
    return
  }
  editor.value?.commands.setContent(value)
})
watch(() => props.tags, (tags) => {
  state.tags.value = tags
})
</script>

<template>
  <div
    :ref="state.root"
  >
    <EditorContent
      :editor="editor"
      class="relative max-w-full w-full overflow-x-hidden overflow-y-auto"
      :class="[props.class]"
    />
    <BubbleMenu
      v-if="props.bubbleMenu"
      :editor="editor"
    />
  </div>
</template>
