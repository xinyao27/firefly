import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import BlockCustom from './BlockCustom'
import type { MessageModel } from '~~/models/Message'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockCustom: {
      setBlockCustom: (position: number, options: {
        from: 'file' | 'message'
        message?: MessageModel
        name?: string
        path?: string
        size?: number
        type?: string
      }) => ReturnType
    }
  }
}

export const ExtensionBlockCustom = Node.create({
  name: 'blockCustom',

  group: 'dBlock',

  content: 'block*',

  draggable: true,

  atom: true,

  addAttributes() {
    return {
      from: { default: null },
      message: { default: null },
      name: { default: null },
      path: { default: null },
      size: { default: null },
      type: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'blockCustom' }]
  },

  renderHTML() {
    return ['blockCustom', 0]
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
