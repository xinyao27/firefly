import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import DraggableItem from './DraggableItem.vue'

export default Node.create({
  name: 'draggableItem',

  priority: 10000,

  group: 'block',

  content: 'block+',

  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-type="draggable-item"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'draggable-item' }), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(DraggableItem)
  },
})
