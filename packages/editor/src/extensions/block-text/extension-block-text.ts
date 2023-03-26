import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'
import Text from './Text.vue'

export interface BlockTextAttrs {
  position: number
  from: 'file' | 'block'
  block?: BlockModel
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockText: {
      setBlockText: (attr: BlockTextAttrs) => ReturnType
    }
  }
}

export const ExtensionBlockText = Node.create({
  name: 'blockText',

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
    return [{ tag: 'div[data-type=blockText]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const block = node.attrs.block as BlockModel
    return [
      'div',
      mergeAttributes(HTMLAttributes, node.attrs, {
        'data-type': 'blockText',
        'class': 'my-1 border border-neutral-700 rounded-sm cursor-pointer transition',
      }),
      [
        'div',
        { class: 'whitespace-pre-line p-2' },
        block.content,
      ],
    ]
  },

  addCommands() {
    return {
      setBlockText: attrs => ({ commands }) => {
        return commands.insertContentAt(attrs.position, {
          type: this.name,
          attrs,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(Text)
  },
})
