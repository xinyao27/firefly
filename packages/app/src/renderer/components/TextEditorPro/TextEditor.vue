<script setup lang="ts">
import 'highlight.js/scss/github-dark.scss'
import './style.sass'
import type { Content } from '@tiptap/vue-3'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import { getExtensions } from './extensions/starter-kit'

const props = withDefaults(
  defineProps<{
    value: Content
    class?: string
    placeholder?: string
    onMounted?: (editor: Editor) => void
  }>(),
  {
    placeholder: '',
  },
)
const emit = defineEmits<{
  (event: 'update:value', value: Content): void
}>()
const { value } = useVModels(props, emit)

const editor = useEditor({
  content: value.value,
  extensions: getExtensions({ placeholder: props.placeholder }),
  editorProps: {
    attributes: {
      id: 'text-editor',
      class: 'min-h-full max-w-full overflow-hidden focus:outline-none prose prose-white',
      spellcheck: 'false',
      suppressContentEditableWarning: 'true',
    },
  },
  autofocus: true,
  onUpdate({ editor }) {
    const content = editor.getJSON()
    value.value = content
  },
})

onMounted(() => {
  if (editor.value)
    props.onMounted?.(editor.value)
})
</script>

<template>
  <EditorContent
    class="overflow-x-hidden overflow-y-auto relative rounded p-2"
    :class="props.class"
    :editor="editor"
  />
</template>

<style lang="sass">
.ProseMirror
  & > *
    margin-top: 0 !important
    margin-bottom: 0 !important
</style>
