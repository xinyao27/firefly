import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands {
    getTextSelection: {
      getTextSelection: () => string
    }
  }
}

export const ExtensionCommands = Extension.create({
  // @ts-expect-error noop
  addCommands: () => {
    return {
      // @ts-expect-error noop
      getTextSelection: () => ({ editor }) => {
        const { from, to, empty } = editor.state.selection

        if (empty)
          return ''

        return editor.state.doc.textBetween(from, to, ' ')
      },
    }
  },
})
