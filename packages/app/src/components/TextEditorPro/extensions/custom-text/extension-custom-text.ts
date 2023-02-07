import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CustomText from './CustomText.vue'
import type { MessageModel } from '~~/models/Message'

export interface CustomTextAttrs {
  position: number
  from: 'file' | 'message'
  message?: MessageModel
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customText: {
      setCustomText: (attr: CustomTextAttrs) => ReturnType
    }
  }
}

export const ExtensionCustomText = Node.create({
  name: 'customText',

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
    return [{ tag: 'div[data-type=customText]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const message = node.attrs.message as MessageModel
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'customText',
        'class': 'overflow-hidden my-1 border border-neutral-700 rounded cursor-pointer transition',
      }),
      [
        'div',
        { class: 'whitespace-pre-line p-2' },
        message.content,
      ],
    ]
  },

  addCommands() {
    return {
      setCustomText: attrs => ({ commands }) => {
        return commands.insertContentAt(attrs.position, {
          type: this.name,
          attrs,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(CustomText)
  },
})
