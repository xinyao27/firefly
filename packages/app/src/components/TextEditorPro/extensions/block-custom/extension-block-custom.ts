import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import BlockCustom from './BlockCustom'
import type { MessageModel } from '~~/models/Message'

export interface BlockCustomAttrs {
  position: number
  from: 'file' | 'message'
  message?: MessageModel
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockCustom: {
      setBlockCustom: (attr: BlockCustomAttrs) => ReturnType
    }
  }
}

export const ExtensionBlockCustom = Node.create({
  name: 'blockCustom',

  group: 'block',

  draggable: true,

  atom: true,

  selectable: true,

  inline: false,

  addAttributes() {
    return {
      from: { default: null },
      message: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'div[class=block-custom]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      setBlockCustom: attrs => ({ commands }) => {
        return commands.insertContentAt(attrs.position, {
          type: this.name,
          attrs,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(BlockCustom)
  },
})
