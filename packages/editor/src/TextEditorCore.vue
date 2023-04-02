<script setup lang="ts">
import 'highlight.js/scss/github.scss'
import './style.sass'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
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
  onCreated?: (editor: Editor) => void
  bubbleMenu?: boolean
}>(), {
  bubbleMenu: true,
})
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)
const emitAfterOnUpdate = ref(false)

const state = useTextEditorState()
const editor = useEditor({
  content: data.value,
  autofocus: true,
  extensions,
  editorProps: {
    attributes: {
      class: 'w-full max-w-full max-h-80 min-h-20 relative text-left transition focus:outline-none',
      suppressContentEditableWarning: 'true',
    },
  },
  onUpdate({ editor }) {
    emitAfterOnUpdate.value = true
    const content = editor.getHTML()
    data.value = content
  },
})

onMounted(() => {
  props.onCreated?.(editor.value!)
  state.tags.value = props.tags
})
onBeforeUnmount(() => {
  editor.value?.destroy()
})
watch(() => props.modelValue, (value) => {
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
      class="relative overflow-x-hidden overflow-y-auto w-full max-w-full"
      :class="[props.class]"
    />
    <BubbleMenu
      v-if="props.bubbleMenu"
      :editor="editor"
    />
  </div>
</template>
