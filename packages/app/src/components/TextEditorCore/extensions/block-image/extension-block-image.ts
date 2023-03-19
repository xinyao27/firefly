import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { BlockModel } from '@firefly/common'
import Image from './Image.vue'

export interface BlockImageAttrs {
  position: number
  from: 'file' | 'block'
  block?: BlockModel
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockImage: {
      setBlockImage: (attr: BlockImageAttrs) => ReturnType
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
    const block = node.attrs.block as BlockModel
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'blockImage',
        'class': 'my-1 border border-neutral-700 rounded cursor-pointer',
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
