import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CustomOther from './CustomOther.vue'
import type { MessageModel } from '~~/models/Message'
import { byteSize } from '~~/utils'

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

  renderHTML({ HTMLAttributes, node }) {
    const message = node.attrs.message as MessageModel
    const title = message.title ?? ''
    const size = byteSize(message.size)?.text ?? ''
    const filePath = message.filePath ?? ''
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'customOther',
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
            filePath,
          ],
        ],
      ],
    ]
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
