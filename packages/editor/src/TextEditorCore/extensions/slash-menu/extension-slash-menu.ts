import { VueRenderer } from '@tiptap/vue-3'
import { Node } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { PluginKey } from '@tiptap/pm/state'
import tippy, { sticky } from 'tippy.js'
import { Suggestion } from '@tiptap/suggestion'
import type { SuggestionOptions } from '@tiptap/suggestion'
import PopMenu from '../../PopMenu.vue'
import { actions } from './actions'

export interface SlashMenuOptions {
  HTMLAttributes: Record<string, any>
  renderLabel: (props: {
    options: SlashMenuOptions
    node: ProseMirrorNode
  }) => string
  suggestion: Omit<SuggestionOptions, 'editor'>
}

export const ExtensionSlashMenu = Node.create<SlashMenuOptions>({
  name: 'slashMenu',

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addProseMirrorPlugins() {
    let component: VueRenderer
    let popup: any
    let localProps: Record<string, any> | undefined
    function destroy() {
      popup[0].destroy()
      component.destroy()
    }

    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        pluginKey: new PluginKey('slashMenu'),
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

          if (overrideSpace)
            range.to += 1

          editor
            .chain()
            .focus()
            .deleteRange(range)
            .run()

          window.getSelection()?.collapseToEnd()
          props.command?.({ editor, range })
          destroy()
        },
        items: ({ query }) => {
          if (query)
            return actions.filter(item => item.label.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)

          return actions
        },
        render: () => {
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
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                sticky: 'reference',
                plugins: [sticky],
              })
            },

            onUpdate(props) {
              localProps = { ...props, event: '' }

              component.updateProps(props)

              if (!props.clientRect)
                return

              popup[0].setProps({ getReferenceClientRect: props.clientRect })
            },

            onKeyDown(props) {
              component.updateProps({ ...localProps, event: props.event })

              if (props.event.key === 'Escape') {
                destroy()

                return true
              }

              return component.ref.onKeyDown({ ...localProps, event: props.event })
            },

            onExit: destroy,
          }
        },
      }),
    ]
  },
})
