import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { byteSize } from '@firefly/common'
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
      setBlockOther: (attr: BlockOtherAttrs) => ReturnType
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
    const block = node.attrs.block as BlockModel
    const title = block.title ?? ''
    const size = byteSize(block.size)?.text ?? ''
    const path = block.path ?? ''
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'blockOther',
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
      setBlockOther: attrs => ({ commands }) => {
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
