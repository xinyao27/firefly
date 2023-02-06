import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CustomImage from './CustomImage.vue'
import type { MessageModel } from '~~/models/Message'

export interface CustomImageAttrs {
  position: number
  from: 'file' | 'message'
  message?: MessageModel
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      setCustomImage: (attr: CustomImageAttrs) => ReturnType
    }
  }
}

export const ExtensionCustomImage = Node.create({
  name: 'customImage',

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
    return [{ tag: 'div[data-type=customImage]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'customImage' })]
  },

  addCommands() {
    return {
      setCustomImage: attrs => ({ commands }) => {
        return commands.insertContentAt(attrs.position, {
          type: this.name,
          attrs,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(CustomImage)
  },
})
