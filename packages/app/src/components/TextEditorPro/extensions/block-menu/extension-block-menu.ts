import type { Editor } from '@tiptap/vue-3'
import { VueRenderer } from '@tiptap/vue-3'
import { Node } from '@tiptap/core'
import type { SuggestionOptions } from '@tiptap/suggestion'
import Suggestion from '@tiptap/suggestion'
import type { Node as ProseMirrorNode } from 'prosemirror-model'
import { PluginKey } from 'prosemirror-state'
import tippy from 'tippy.js'
import BlockMenuList from './BlockMenuList.vue'

export interface BlockMenuOptions {
  HTMLAttributes: Record<string, any>
  renderLabel: (props: {
    options: BlockMenuOptions
    node: ProseMirrorNode
  }) => string
  suggestion: Omit<SuggestionOptions, 'editor'>
}

export const ExtensionBlockMenu = Node.create<BlockMenuOptions>({
  name: 'blockMenu',

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addProseMirrorPlugins() {
    let component: VueRenderer
    let popup: any
    function destroy() {
      popup[0].destroy()
      component.destroy()
    }

    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        pluginKey: new PluginKey('blockMenu'),
        decorationClass: 'block',
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          const type = state.schema.nodes[this.name]
          const allow = !!$from.parent.type.contentMatch.matchType(type)

          return allow
        },
        command: ({ editor, range, props }) => {
          const nodeAfter = editor.view.state.selection.$to.nodeAfter
          const overrideSpace = nodeAfter?.text?.startsWith(' ')

          if (overrideSpace) {
            range.to += 1
          }

          editor
            .chain()
            .focus()
            .deleteRange(range)
            .run()

          window.getSelection()?.collapseToEnd()
          props.command?.(editor)
          destroy()
        },
        items: ({ query }) => {
          return [
            {
              label: 'Heading 1',
              description: 'Big section heading.',
              value: 'h1',
              icon: 'i-ri-h-1',
              command: (editor: Editor) => {
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              },
            },
            {
              label: 'Heading 2',
              description: 'Medium section heading.',
              value: 'h2',
              icon: 'i-ri-h-2',
              command: (editor: Editor) => {
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              },
            },
            {
              label: 'Heading 3',
              description: 'Small section heading.',
              value: 'h3',
              icon: 'i-ri-h-3',
              command: (editor: Editor) => {
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              },
            },
          ].filter(item => item.label.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
        },
        render: () => {
          return {
            onStart: (props) => {
              component = new VueRenderer(BlockMenuList, {
                props,
                editor: props.editor,
              })

              if (!props.clientRect) {
                return
              }
              popup = tippy('body', {
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },

            onUpdate(props) {
              component.updateProps(props)

              if (!props.clientRect) {
                return
              }

              popup[0].setProps({ getReferenceClientRect: props.clientRect })
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                popup[0].hide()

                return true
              }

              return component.ref?.onKeyDown(props)
            },

            onExit: destroy,
          }
        },
      }),
    ]
  },
})
