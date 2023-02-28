import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { MetaData } from 'metadata-scraper'
import Link from './Link.vue'
import type { BlockModel } from '~/models/Block'

export interface BlockLinkAttrs {
  position: number
  from: 'file' | 'block'
  block?: BlockModel
  metadata?: MetaData
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockLink: {
      setBlockLink: (attr: BlockLinkAttrs) => ReturnType
    }
  }
}

export const ExtensionBlockLink = Node.create({
  name: 'blockLink',

  group: 'block',

  draggable: true,

  atom: true,

  selectable: true,

  inline: false,

  addAttributes() {
    return {
      from: { default: null },
      block: { default: null },
      metadata: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type=blockLink]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const block = node.attrs.block as BlockModel
    const metadata = node.attrs.metadata as MetaData
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'blockLink',
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
              block.link ?? '',
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
      setBlockLink: attrs => ({ commands }) => {
        return commands.insertContentAt(attrs.position, {
          type: this.name,
          attrs,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(Link)
  },
})
