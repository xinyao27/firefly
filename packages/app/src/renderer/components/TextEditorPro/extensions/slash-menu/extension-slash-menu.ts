import { VueRenderer } from '@tiptap/vue-3'
import { Node } from '@tiptap/core'
import type { Node as ProseMirrorNode } from 'prosemirror-model'
import { PluginKey } from 'prosemirror-state'
import tippy from 'tippy.js'
import { Suggestion } from '@tiptap/suggestion'
import type { SuggestionOptions } from '@tiptap/suggestion'
import SlashMenuList from './SlashMenuList.vue'
import { commands } from './commands'

export interface BlockMenuOptions {
  HTMLAttributes: Record<string, any>
  renderLabel: (props: {
    options: BlockMenuOptions
    node: ProseMirrorNode
  }) => string
  suggestion: Omit<SuggestionOptions, 'editor'>
}

export const ExtensionSlashMenu = Node.create<BlockMenuOptions>({
  name: 'blockMenu',

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addProseMirrorPlugins() {
    const textEditorStore = useTextEditorStore()

    let component: VueRenderer
    let popup: any
    let localProps: Record<string, any> | undefined
    function destroy() {
      popup[0].destroy()
      component.destroy()
      textEditorStore.slashMenuShow = false
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
          props.command?.({ editor, range })
          destroy()
        },
        items: ({ query }) => {
          if (query) {
            return commands.filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
          }
          return commands
        },
        render: () => {
          return {
            onStart: (props) => {
              localProps = { ...props, event: '' }

              component = new VueRenderer(SlashMenuList, {
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
              textEditorStore.slashMenuShow = true
            },

            onUpdate(props) {
              localProps = { ...props, event: '' }

              component.updateProps(props)

              if (!props.clientRect) {
                return
              }

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
