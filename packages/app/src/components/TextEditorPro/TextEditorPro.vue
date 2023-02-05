
<script setup lang="ts">
import { EditorContent, generateJSON, useEditor } from '@tiptap/vue-3'
import 'highlight.js/scss/github-dark.scss'
import Draggable from 'vuedraggable'
import BubbleMenu from './BubbleMenu.vue'
import CharacterCount from './CharacterCount.vue'
import { extensions } from './extensions/starter-kit'

const configStore = useConfigStore()
const messageStore = useMessageStore()

const html = ref('')
const content = computed(() => {
  const json = generateJSON(html.value, extensions)
  return json
})
const editor = useEditor({
  content: content.value,
  extensions,
})
watchEffect(() => {
  editor.value?.setOptions({
    editorProps: {
      attributes: {
        class: 'min-h-full mx-auto my-4 focus:outline-none prose prose-white',
        style: 'min-height: 100%',
      },
    },
  })
})
</script>

<template>
  <Draggable
    v-model="messageStore.textEditorMessages"
    :group="{ name: 'messageDraggable' }"
    item-key="id"
  >
    <template #header>
      <BubbleMenu :editor="editor" />
      <EditorContent
        :style="`height: calc(100vh - ${configStore.rootPaddingTop}px)`"
        :editor="editor"
      />
      <CharacterCount :editor="editor" />
    </template>

    <template #item="{ element }">
      <div v-show="false">
        <ListRow
          functional="draggable"
          :message="element"
          :size="72"
        />
      </div>
    </template>
  </Draggable>
</template>

<style lang="sass">
.ProseMirror
  pre
    @apply text-white bg-dark-400
    padding-left: 1em
    padding-right: 1em
    padding-top: 0.75em
    padding-bottom: 0.75em
    border-radius: 0.5em
    code
      @apply text-white p-0 bg-transparent
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

  .is-block-empty
    &::before
      content: attr(data-placeholder)
      @apply pointer-events-none h-0 float-left text-neutral-600 capitalize

.drag-handle
  @apply absolute z-100 w-5 h-5 flex items-center justify-center cursor-grab transition hover:bg-neutral-600
  &.show
    @apply opacity-30 visible
  &.hide
    @apply opacity-0 invisible
</style>
