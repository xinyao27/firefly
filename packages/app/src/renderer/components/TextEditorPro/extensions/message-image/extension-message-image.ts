import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MessageImage from './MessageImage.vue'
import type { MessageModel } from '~/models/Message'

export interface MessageImageAttrs {
  position: number
  from: 'file' | 'message'
  message?: MessageModel
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    messageImage: {
      setMessageImage: (attr: MessageImageAttrs) => ReturnType
    }
  }
}

export const ExtensionMessageImage = Node.create({
  name: 'messageImage',

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
    return [{ tag: 'div[data-type=messageImage]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const message = node.attrs.message as MessageModel
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'messageImage',
        'class': 'my-1 border border-neutral-700 rounded cursor-pointer',
      }),
      [
        'img',
        {
          src: message.filePath,
          alt: message.title,
        },
      ],
    ]
  },

  addCommands() {
    return {
      setMessageImage: attrs => ({ commands }) => {
        return commands.insertContentAt(attrs.position, {
          type: this.name,
          attrs,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(MessageImage)
  },
})
