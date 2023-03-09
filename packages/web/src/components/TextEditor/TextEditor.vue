<script setup lang="ts">
import 'highlight.js/scss/github-dark.scss'
import './style.sass'
import type { JSONContent } from '@tiptap/vue-3'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { debounce } from 'lodash-es'
import BubbleMenu from './BubbleMenu'
import { extensions } from './extensions/starter-kit'

const configStore = useConfigStore()
const blockStore = useBlockStore()
const textEditorStore = useTextEditorStore()

const currentBlock = computed(() => blockStore.currentBlock)

const handleUpdate = debounce((content: JSONContent) => {
  if (currentBlock.value)
    blockStore.updateArticleContent(currentBlock.value?.id, JSON.stringify(content))
}, 300)
const editor = useEditor({
  extensions,
  editorProps: {
    attributes: {
      id: 'text-editor-pro',
      class: 'max-w-full px-[calc((100%-65ch)/2)] overflow-hidden focus:outline-none prose prose-white',
      style: `min-height: calc(100vh - ${configStore.rootPaddingTop}px - 46px)`,
      spellcheck: 'false',
      suppressContentEditableWarning: 'true',
    },
  },
  autofocus: true,
  onUpdate({ editor }) {
    if (currentBlock.value) {
      const content = editor.getJSON()
      handleUpdate(content)
    }
  },
})

onMounted(() => {
  textEditorStore.editor = editor.value
  editor.value?.commands.setContent(JSON.parse(currentBlock.value?.content || '{}') as JSONContent)
  editor.value?.commands.focus()
})
watch(currentBlock, (value) => {
  editor.value?.commands.setContent(JSON.parse(value?.content || '{}') as JSONContent)
  editor.value?.commands.focus()
})
</script>

<template>
  <div h-full flex flex-col relative>
    <EditorContent
      class="flex-1 overflow-x-hidden overflow-y-auto relative"
      :editor="editor"
    />
    <BubbleMenu :editor="editor" />
  </div>
</template>
