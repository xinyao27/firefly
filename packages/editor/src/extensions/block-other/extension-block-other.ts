import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'
import Other from './Other.vue'

export interface BlockOtherAttrs {
  position: number
  from: 'file' | 'block'
  block?: BlockModel
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockOther: {
      setBlockOtherAt: (attr: BlockOtherAttrs) => ReturnType
    }
  }
}

export const ExtensionBlockOther = Node.create({
  name: 'blockOther',

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
    return [{ tag: 'div[data-type=blockOther]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const block = typeof node.attrs.block === 'string' ? JSON.parse(node.attrs.block) : node.attrs.block
    const title = block.title ?? ''
    const path = block.path ?? ''
    return [
      'div',
      mergeAttributes(HTMLAttributes, node.attrs, {
        'data-type': 'blockOther',
        'class': 'border rounded-sm cursor-pointer border-neutral-500 my-1',
        'block': JSON.stringify(block),
      }),
      [
        'div',
        { class: 'flex p-2 transition items-center justify-between hover:bg-neutral-500' },
        [
          'div',
          { class: 'flex gap-2 items-center select-none pointer-events-none' },
          [
            'div',
            { class: 'i-ri-attachment-line' },
          ],
          [
            'div',
            { class: 'flex flex-col' },
            [
              'div',
              { class: 'flex gap-2 items-center' },
              title,
            ],
            [
              'div',
              { class: 'text-neutral text-xs' },
              path,
            ],
          ],
        ],
        [
          'i',
          { class: 'i-ri-external-link-line' },
        ],
      ],
    ]
  },

  addCommands() {
    return {
      setBlockOtherAt: attrs => ({ commands }) => {
        return commands.insertContentAt(attrs.position, {
          type: this.name,
          attrs,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(Other)
  },
})
