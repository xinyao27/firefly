import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import DBlock from './DBlock.vue'
import { useTextEditorStateStore } from '~/store/textEditorState'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    dBlock: {
      setDBlock: (position?: number) => ReturnType
    }
  }
}

export const ExtensionDBlock = Node.create({
  name: 'dBlock',

  priority: 1000,

  group: 'dBlock',

  content: 'block',

  draggable: true,

  selectable: false,

  inline: false,

  addOptions() {
    return { HTMLAttributes: {} }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="block"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'block' }),
      0,
    ]
  },

  addCommands() {
    return {
      setDBlock: position => ({ state, chain }) => {
        const { selection: { from } } = state

        const pos
          = position !== undefined || position !== null ? from : position

        return chain()
          .insertContentAt(pos, {
            type: this.name,
            content: [{ type: 'paragraph' }],
          })
          .focus(pos + 2)
          .run()
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(DBlock)
  },

  addKeyboardShortcuts() {
    const textEditorState = useTextEditorStateStore()
    return {
      'Mod-Alt-0': () => this.editor.commands.setDBlock(),
      'Enter': ({ editor }) => {
        if (textEditorState.slashMenuShow === true) return false

        const {
          selection: { $head, from, to },
          doc,
        } = editor.state

        const parent = $head.node($head.depth - 1)

        if (parent.type.name !== 'dBlock') {
          if (parent.type.name === 'listItem') {
            if (parent.lastChild?.content.size !== undefined && (parent.lastChild.content.size <= 0)) {
              // TODO 将现有行删除
              return editor
                .chain()
                .insertContent({
                  type: this.name,
                  content: [{ type: 'paragraph' }],
                })
                .focus(from + 4)
                .run()
            }
            return false
          }
          return false
        }

        let currentActiveNodeTo = -1

        doc.descendants((node, pos) => {
          if (currentActiveNodeTo !== -1) return false
          if (node.type.name === this.name) return

          const [nodeFrom, nodeTo] = [pos, pos + node.nodeSize]

          if (nodeFrom <= from && to <= nodeTo) currentActiveNodeTo = nodeTo

          return false
        })

        const content = doc.slice(from, currentActiveNodeTo)?.toJSON().content

        return editor
          .chain()
          .insertContentAt(
            { from, to: currentActiveNodeTo },
            {
              type: this.name,
              content,
            },
          )
          .focus(from + 4)
          .run()
      },
    }
  },
})
