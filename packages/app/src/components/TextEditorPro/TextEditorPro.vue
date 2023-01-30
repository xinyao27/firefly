
<script setup lang="ts">
import { EditorContent, generateJSON, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ExtensionImage from '@tiptap/extension-image'
import ExtensionUnderline from '@tiptap/extension-underline'
import ExtensionCodeBlockLowLight from '@tiptap/extension-code-block-lowlight'
import ExtensionTypography from '@tiptap/extension-typography'
import ExtensionCharacterCount from '@tiptap/extension-character-count'
import ExtensionPlaceholder from '@tiptap/extension-placeholder'
import 'highlight.js/scss/github-dark.scss'
import { lowlight } from 'lowlight'
import { colors } from 'unocss/preset-mini'
import BubbleMenu from './BubbleMenu.vue'
import CharacterCount from './CharacterCount.vue'
import ExtensionDrop from './extension-drop'
import ExtensionColor from './extension-color'
import ExtensionBlockMenu from './extension-block-menu'
import ExtensionCustomItem from './extension-custom-item'

const configStore = useConfigStore()

const extensions = [
  StarterKit.configure({
    dropcursor: {
      // @ts-expect-error noop
      color: colors?.blue['400'],
      width: 4,
    },
  }),
  ExtensionImage.configure({ allowBase64: true }),
  ExtensionUnderline,
  ExtensionCodeBlockLowLight.configure({ lowlight }),
  ExtensionTypography,
  ExtensionCharacterCount,
  ExtensionDrop,
  ExtensionColor,
  ExtensionBlockMenu,
  ExtensionPlaceholder.configure({
    emptyNodeClass: 'empty-node',
    placeholder({ node }) {
      return node.type.name
    },
  }),
  ExtensionCustomItem,
]
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
        class: 'min-h-full mx-auto my-5 focus:outline-none prose prose-white',
        style: 'min-height: 100%;' + `font-size: ${20 * configStore.baseSize / 100}px`,
      },
    },
  })
})
</script>

<template>
  <BubbleMenu :editor="editor" />
  <EditorContent
    :style="`height: calc(100vh - ${configStore.rootPaddingTop}px)`"
    :editor="editor"
  />
  <CharacterCount :editor="editor" />
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

  .empty-node
    &::before
      content: attr(data-placeholder)
      @apply pointer-events-none h-0 float-left text-neutral-600 capitalize
</style>
