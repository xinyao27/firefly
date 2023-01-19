
<script setup lang="ts">
import { EditorContent, generateJSON, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ExtensionImage from '@tiptap/extension-image'
import ExtensionUnderline from '@tiptap/extension-underline'
import ExtensionCodeBlockLowLight from '@tiptap/extension-code-block-lowlight'
import ExtensionTypography from '@tiptap/extension-typography'
import ExtensionCharacterCount from '@tiptap/extension-character-count'
import 'highlight.js/scss/github-dark.scss'
import { lowlight } from 'lowlight'
import { colors } from 'unocss/preset-mini'
import BubbleMenu from './BubbleMenu.vue'
import CharacterCount from './CharacterCount.vue'
import ExtensionDrop from './extension-drop'

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
  ExtensionDrop,
  ExtensionCharacterCount,
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
    <p>
      I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
    </p>
    <img src="https://source.unsplash.com/8xznAGy4HcY/800x400" />
    <blockquote>
      Wow, that’s amazing. Good work, boy! 👏
      <br />
      — Mom
    </blockquote>
  `)
const content = computed(() => {
  const json = generateJSON(html.value, extensions)
  return json
})
const editor = useEditor({
  content: content.value,
  extensions,
  editorProps: {
    attributes: {
      class: 'min-h-full mx-auto my-5 focus:outline-none prose prose-white',
      style: 'min-height: 100%',
    },
  },
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
    @apply text-white bg-dark-400 px-4 py-3 rounded-2
    code
      @apply text-white p-0 bg-transparent text-sm

  code
    @apply font-mono bg-dark-200 text-red-400 rounded text-xs px-1.5 py-1 before:content-[""] after:content-[""]
</style>
