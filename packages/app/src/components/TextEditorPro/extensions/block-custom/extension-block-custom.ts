import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import BlockCustom from './BlockCustom'
import type { MessageModel } from '~~/models/Message'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockCustom: {
      setBlockCustom: (position: number, options: {
        from: 'file' | 'message'
        message?: MessageModel
      }) => ReturnType
    }
  }
}

export const ExtensionBlockCustom = Node.create({
  name: 'blockCustom',

  group: 'block',

  content: 'block*',

  addAttributes() {
    return {
      from: { default: null },
      message: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'blockCustom' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['blockCustom', mergeAttributes(HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setBlockCustom: (position, options) => ({ commands }) => {
        return commands.insertContentAt(position, {
          type: this.name,
          attrs: options,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(BlockCustom)
  },

})
