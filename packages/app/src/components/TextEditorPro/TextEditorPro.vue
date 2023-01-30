
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
]
const html = ref(`
    <h2>
      Hi there,
    </h2>
    <p>
      this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
    </p>
    <ul>
      <li>
        That’s a bullet list with one …
      </li>
      <li>
        … or two list items.
      </li>
    </ul>
    <p>
      Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
    </p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<img src="https://source.unsplash.com/8xznAGy4HcY/800x400" />
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
  </blockquote>
  <p>
    I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
  </p>
  `)
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
