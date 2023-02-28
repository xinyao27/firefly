<script setup lang="ts">
import type { JSONContent } from '@tiptap/vue-3'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import 'highlight.js/scss/github-dark.scss'
import { debounce } from 'lodash-es'
import Title from './Title'
import BubbleMenu from './BubbleMenu'
import CharacterCount from './CharacterCount.vue'
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
      id: 'text-editor',
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
    <Title :editor="editor" />
    <EditorContent
      class="flex-1 overflow-x-hidden overflow-y-auto relative"
      :editor="editor"
    />
    <CharacterCount :editor="editor" />
    <BubbleMenu :editor="editor" />
  </div>
</template>

<style lang="sass">
.ProseMirror
  > *
    @apply relative overflow-x-visible after:(content-empty block w-20 h-full absolute -left-20 top-0 z-99 cursor-default)
  > * + *
    margin-top: 0.75em
  pre
    @apply text-white bg-dark-400
    padding-left: 1em
    padding-right: 1em
    padding-top: 0.75em
    padding-bottom: 0.75em
    border-radius: 0.5em
    code
      @apply text-white p-0 bg-transparent overflow-x-auto
      font-size: 0.875em
      line-height: 1.25em
  code
    @apply font-mono bg-dark-200 text-red-400 rounded before:content-[""] after:content-[""]
    font-size: 0.75em
    line-height: 1em
    padding-left: 0.375em
    padding-right: 0.375em
    padding-top: 0.25em
    padding-bottom: 0.25em
  .color
    &::before
      @apply inline-block rounded v-middle
      content: ' '
      width: 1em
      height: 1em
      margin-right: 0.15em
      margin-bottom: 0.15em
      background-color: var(--color)
  .is-empty
    @apply before:(content-[attr(data-placeholder)] pointer-events-none h-0 float-left text-neutral-600 capitalize)
  &.ProseMirror-hideselection > .ProseMirror-gapcursor:last-child
    caret-color: auto !important
    &::before
      @apply pointer-events-none h-0 float-left text-neutral-600 capitalize
      content: "输入 `/` 调用命令..."

.drag-handle
  @apply absolute z-100 w-6 h-6 rounded flex items-center justify-center cursor-grab transition hover:bg-neutral-600
  &.show
    @apply opacity-30 visible
  &.hide
    @apply opacity-0 invisible
</style>
