import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MessageText from './MessageText.vue'
import type { MessageModel } from '~/models/Message'

export interface MessageTextAttrs {
  position: number
  from: 'file' | 'message'
  message?: MessageModel
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    messageText: {
      setMessageText: (attr: MessageTextAttrs) => ReturnType
    }
  }
}

export const ExtensionMessageText = Node.create({
  name: 'messageText',

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
    return [{ tag: 'div[data-type=messageText]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const message = node.attrs.message as MessageModel
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'messageText',
        'class': 'my-1 border border-neutral-700 rounded cursor-pointer transition',
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
      setMessageText: attrs => ({ commands }) => {
        return commands.insertContentAt(attrs.position, {
          type: this.name,
          attrs,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(MessageText)
  },
})
