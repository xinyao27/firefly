import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CustomItem from './CustomItem.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    custom: {
      insertCustomItemAt: (position: number, options: {
        name: string
        path: string
        size: number
        type: string
      }) => ReturnType
    }
  }
}

export default Node.create({
  name: 'custom-item',

  group: 'block',

  content: 'block*',

  draggable: true,

  atom: true,

  addAttributes() {
    return {
      name: { default: null },
      path: { default: null },
      size: { default: null },
      type: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'custom-item' }]
  },

  renderHTML() {
    return ['custom-item', 0]
  },

  addCommands() {
    return {
      insertCustomItemAt: (position, options) => ({ commands }) => {
        return commands.insertContentAt(position, {
          type: this.name,
          attrs: options,
        })
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(CustomItem)
  },

})
