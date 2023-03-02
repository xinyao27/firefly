import type { Content, Editor } from '@tiptap/core'
import { defineStore } from 'pinia'
import type { Schema } from 'prosemirror-model'
import {
  MarkdownSerializer as ProseMirrorMarkdownSerializer,
  defaultMarkdownSerializer,
} from 'prosemirror-markdown'

export const useTextEditorStore = defineStore('textEditor', {
  state: () => {
    return {
      slashMenuShow: false,
      aiMenuShow: false,
      editor: undefined as Editor | undefined,
    }
  },
  actions: {
    insertContent(content: Content) {
      const editor = this.editor as Editor
      if (editor) {
        editor.commands.focus()
        const { to } = editor.state.selection
        const position = to + 1
        editor.commands.insertContentAt(position, content, { updateSelection: true })
        const node = editor.state.doc.nodeAt(position)
        const range = {
          from: position,
          to: position + (node?.nodeSize ?? 0),
        }
        editor.commands.setTextSelection(range)
      }
    },

    toMarkdown(content: Content, schema: Schema) {
      const proseMirrorDocument = schema.nodeFromJSON(content)
      const serializer = new ProseMirrorMarkdownSerializer(
        defaultMarkdownSerializer.nodes,
        defaultMarkdownSerializer.marks,
      )

      return serializer.serialize(proseMirrorDocument, { tightLists: true })
    },
  },
})
