import type { Content, Editor } from '@tiptap/core'
import { defineStore } from 'pinia'

export const useTextEditorStore = defineStore('textEditor', {
  state: () => {
    return {
      slashMenuShow: false,
      editor: undefined as Editor | undefined,
    }
  },
  actions: {
    insertContent(content: Content) {
      const editor = this.editor as Editor
      if (editor) {
        editor.commands.insertContent(content)
        editor.commands.focus()
      }
    },
  },
})
