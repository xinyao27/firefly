import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'
import Link from './Link.vue'

export interface BlockLinkAttrs {
  position: number
  from: 'file' | 'block'
  block?: BlockModel
  metadata?: any
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
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type=blockLink]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const block = node.attrs.block as BlockModel
    const metadata = block.metadata
    return [
      'div',
      mergeAttributes(HTMLAttributes, node.attrs, {
        'data-type': 'blockLink',
        'class': 'my-1 border border-neutral-500 rounded-sm cursor-pointer transition',
        'block': JSON.stringify(block),
      }),
      [
        'a',
        { class: 'overflow-hidden grid grid-cols-12 gap-2 transition hover:bg-neutral-500 no-underline', href: block.link ?? '', target: '_blank' },
        [
          'div',
          { class: 'flex flex-col justify-between gap-2 p-4 col-span-7' },
          [
            'div',
            { class: 'flex flex-col gap-2' },
            [
              'div',
              { class: 'truncate' },
              metadata?.title || metadata?.['og:title'] || metadata?.['twitter:title'] || '',
            ],
            [
              'div',
              { class: 'line-clamp-2 text-neutral text-xs' },
              metadata?.description || metadata?.['og:description'] || metadata?.['twitter:description'] || '',
            ],
          ],
          [
            'div',
            { class: 'flex text-xs items-center' },
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
              src: metadata?.image || metadata?.['og:image'] || metadata?.['twitter:image'] || 'https://via.placeholder.com/300x300.png?text=No+Image' || '',
              alt: metadata?.['og:image:alt'] || metadata?.['twitter:image:alt'] || metadata?.title || metadata?.['og:title'] || metadata?.['twitter:title'] || '',
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
