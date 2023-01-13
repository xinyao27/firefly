
<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import TipTapStarterKit from '@tiptap/starter-kit'

const configStore = useConfigStore()

const editor = useEditor({
  content: `
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
    <blockquote>
      Wow, that’s amazing. Good work, boy! 👏
      <br />
      — Mom
    </blockquote>
  `,
  extensions: [TipTapStarterKit],
  editorProps: {
    attributes: {
      class: 'min-h-full prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto my-5 focus:outline-none',
      style: 'min-height: 100%',
    },
  },
})
</script>

<template>
  <EditorContent
    :style="`height: calc(100vh - ${configStore.rootPaddingTop}px)`"
    :editor="editor"
  />
</template>
