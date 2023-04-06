import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'
import Image from './Image.vue'

export interface BlockImageAttrs {
  from: 'file' | 'block'
  block?: BlockModel
}
export interface BlockImageAtAttrs extends BlockImageAttrs {
  position: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockImage: {
      setBlockImage: (attr: BlockImageAttrs) => ReturnType
      setBlockImageAt: (attr: BlockImageAtAttrs) => ReturnType
    }
  }
}

export const ExtensionBlockImage = Node.create({
  name: 'blockImage',

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
    return [{ tag: 'div[data-type=blockImage]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const block = typeof node.attrs.block === 'string' ? JSON.parse(node.attrs.block) : node.attrs.block
    return [
      'div',
      mergeAttributes(HTMLAttributes, node.attrs, {
        'data-type': 'blockImage',
        'class': 'border rounded-sm cursor-pointer border-neutral-500 my-1',
        'block': JSON.stringify(block),
      }),
      [
        'img',
        {
          src: block.path,
          alt: block.title,
        },
      ],
    ]
  },

  addCommands() {
    return {
      setBlockImage: attrs => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs,
        })
      },
      setBlockImageAt: attrs => ({ commands }) => {
        return commands.insertContentAt(attrs.position, {
          type: this.name,
          attrs,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(Image)
  },
})
