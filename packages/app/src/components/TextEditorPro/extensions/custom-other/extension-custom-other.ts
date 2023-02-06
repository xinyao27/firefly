import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CustomOther from './CustomOther.vue'
import type { MessageModel } from '~~/models/Message'

export interface CustomOtherAttrs {
  position: number
  from: 'file' | 'message'
  message?: MessageModel
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customOther: {
      setCustomOther: (attr: CustomOtherAttrs) => ReturnType
    }
  }
}

export const ExtensionCustomOther = Node.create({
  name: 'customOther',

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
    return [{ tag: 'div[data-type=customOther]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'customOther' })]
  },

  addCommands() {
    return {
      setCustomOther: attrs => ({ commands }) => {
        return commands.insertContentAt(attrs.position, {
          type: this.name,
          attrs,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(CustomOther)
  },
})
