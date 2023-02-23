import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { byteSize } from '@firefly/utils'
import MessageOther from './MessageOther.vue'
import type { MessageModel } from '~/models/Message'

export interface MessageOtherAttrs {
  position: number
  from: 'file' | 'message'
  message?: MessageModel
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    messageOther: {
      setMessageOther: (attr: MessageOtherAttrs) => ReturnType
    }
  }
}

export const ExtensionMessageOther = Node.create({
  name: 'messageOther',

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
    return [{ tag: 'div[data-type=messageOther]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const message = node.attrs.message as MessageModel
    const title = message.title ?? ''
    const size = byteSize(message.size)?.text ?? ''
    const path = message.path ?? ''
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'messageOther',
        'class': 'my-1 border border-neutral-700 rounded cursor-pointer transition',
      }),
      [
        'div',
        { class: 'p-2 flex items-center gap-2 select-none pointer-events-none' },
        [
          'div',
          { class: 'i-ri-file-3-line block text-lg' },
        ],
        [
          'div',
          { class: 'flex flex-col' },
          [
            'div',
            { class: 'flex items-center gap-2' },
            [
              'div',
              {},
              title,
            ],
            [
              'div',
              { class: 'text-neutral text-xs' },
              size,
            ],
          ],
          [
            'div',
            { class: 'text-neutral text-xs' },
            path,
          ],
        ],
      ],
    ]
  },

  addCommands() {
    return {
      setMessageOther: attrs => ({ commands }) => {
        return commands.insertContentAt(attrs.position, {
          type: this.name,
          attrs,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(MessageOther)
  },
})
