import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { MetaData } from 'metadata-scraper'
import CustomLink from './CustomLink.vue'
import type { MessageModel } from '~/models/Message'

export interface CustomLinkAttrs {
  position: number
  from: 'file' | 'message'
  message?: MessageModel
  metadata?: MetaData
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customLink: {
      setCustomLink: (attr: CustomLinkAttrs) => ReturnType
    }
  }
}

export const ExtensionCustomLink = Node.create({
  name: 'customLink',

  group: 'block',

  draggable: true,

  atom: true,

  selectable: true,

  inline: false,

  addAttributes() {
    return {
      from: { default: null },
      message: { default: null },
      metadata: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type=customLink]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const message = node.attrs.message as MessageModel
    const metadata = node.attrs.metadata as MetaData
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'customLink',
        'class': 'my-1 border border-neutral-700 rounded cursor-pointer transition',
      }),
      [
        'div',
        { class: 'overflow-hidden grid grid-cols-12 gap-2' },
        [
          'div',
          { class: 'flex flex-col justify-between gap-2 p-4 col-span-7' },
          [
            'div',
            { class: 'flex flex-col gap-2' },
            [
              'div',
              {},
              metadata.title ?? '',
            ],
            [
              'div',
              { class: 'line-clamp-2 text-neutral text-xs' },
              metadata.description ?? '',
            ],
          ],
          [
            'div',
            { class: 'flex items-center gap-2 text-xs' },
            [
              'img',
              {
                class: 'w-4 h-4',
                src: metadata.icon ?? '',
                alt: metadata.title ?? '',
              },
            ],
            [
              'div',
              { class: 'truncate' },
              message.link ?? '',
            ],
          ],
        ],
        [
          'div',
          { class: 'col-span-5 h-120px' },
          [
            'img',
            {
              class: 'w-full h-full',
              src: metadata.image ?? '',
              alt: metadata.title ?? '',
            },
          ],
        ],
      ],
    ]
  },

  addCommands() {
    return {
      setCustomLink: attrs => ({ commands }) => {
        return commands.insertContentAt(attrs.position, {
          type: this.name,
          attrs,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(CustomLink)
  },
})
