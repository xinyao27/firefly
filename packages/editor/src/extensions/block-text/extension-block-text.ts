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
      setBlockTextAt: (attr: BlockTextAttrs) => ReturnType
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
    const block = typeof node.attrs.block === 'string' ? JSON.parse(node.attrs.block) : node.attrs.block
    return [
      'div',
      mergeAttributes(HTMLAttributes, node.attrs, {
        'data-type': 'blockText',
        'class': 'my-1 border border-neutral-500 rounded-sm cursor-pointer',
        'block': JSON.stringify(block),
      }),
      [
        'div',
        { class: 'whitespace-pre-line p-2 transition hover:bg-neutral-500' },
        block.content,
      ],
    ]
  },

  addCommands() {
    return {
      setBlockTextAt: attrs => ({ commands }) => {
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
