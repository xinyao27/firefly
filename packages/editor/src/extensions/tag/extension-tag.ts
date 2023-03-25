import { Node, mergeAttributes } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import type { SuggestionOptions } from '@tiptap/suggestion'
import Suggestion from '@tiptap/suggestion'
import { PluginKey } from '@tiptap/pm/state'
import { VueRenderer } from '@tiptap/vue-3'
import type { Instance } from 'tippy.js'
import tippy from 'tippy.js'
import PopMenu from '../../PopMenu.vue'
import { useTextEditorState } from '../../state'

const TagPluginKey = new PluginKey('tag')

export interface TagOptions {
  HTMLAttributes: Record<string, any>
  renderLabel: (props: { options: TagOptions; node: ProseMirrorNode }) => string
  suggestion: Omit<SuggestionOptions, 'editor'>
}

export const ExtensionTag = Node.create<TagOptions>({
  name: 'tag',

  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ options, node }) {
        return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
      },
      suggestion: {
        char: '#',

        pluginKey: TagPluginKey,

        command: ({ editor, range, props }) => {
          const nodeAfter = editor.view.state.selection.$to.nodeAfter
          const overrideSpace = nodeAfter?.text?.startsWith(' ')

          if (overrideSpace)
            range.to += 1

          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: props,
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .run()

          window.getSelection()?.collapseToEnd()
        },

        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          const type = state.schema.nodes[this.name]
          const allow = !!$from.parent.type.contentMatch.matchType(type)

          return allow
        },

        items: ({ query }) => {
          const state = useTextEditorState()
          const tags = state.tags.value.map(v => ({
            label: v.name,
            icon: v.icon,
          }))
          if (query)
            return tags.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)

          return tags
        },

        render: () => {
          let component: VueRenderer
          let popup: Instance[]
          let localProps: Record<string, any> | undefined
          const state = useTextEditorState()

          return {
            onStart: (props) => {
              localProps = { ...props, event: '' }

              component = new VueRenderer(PopMenu, {
                props,
                editor: props.editor,
              })

              if (!props.clientRect)
                return

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect as () => DOMRect,
                appendTo: state.root.value,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },

            onUpdate(props) {
              localProps = { ...props, event: '' }

              component.updateProps(props)

              if (!props.clientRect)
                return

              popup[0].setProps({
                getReferenceClientRect: props.clientRect as () => DOMRect,
              })
            },

            onKeyDown(props) {
              component.updateProps({ ...localProps, event: props.event })

              if (props.event.key === 'Escape') {
                popup[0].hide()

                return true
              }

              return component.ref.onKeyDown({ ...localProps, event: props.event })
            },

            onExit() {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
      },
    }
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id)
            return {}

          return {
            'data-id': attributes.id,
          }
        },
      },

      label: {
        default: null,
        parseHTML: element => element.getAttribute('data-label'),
        renderHTML: (attributes) => {
          if (!attributes.label)
            return {}

          return {
            'data-label': attributes.label,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
      this.options.renderLabel({
        options: this.options,
        node,
      }),
    ]
  },

  renderText({ node }) {
    return this.options.renderLabel({
      options: this.options,
      node,
    })
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.command(({ tr, state }) => {
        let isTag = false
        const { selection } = state
        const { empty, anchor } = selection

        if (!empty)
          return false

        state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
          if (node.type.name === this.name) {
            isTag = true
            tr.insertText(this.options.suggestion.char || '', pos, pos + node.nodeSize)

            return false
          }
          return undefined
        })

        return isTag
      }),
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
