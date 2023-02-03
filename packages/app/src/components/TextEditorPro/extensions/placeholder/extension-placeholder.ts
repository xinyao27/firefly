import type { Editor } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import { Plugin } from 'prosemirror-state'
import type { Node as ProsemirrorNode } from 'prosemirror-model'
import { Decoration, DecorationSet } from 'prosemirror-view'

export interface PlaceholderOptions {
  emptyEditorClass: string
  emptyNodeClass: string
  placeholder:
  | ((PlaceholderProps: {
    editor: Editor
    node: ProsemirrorNode
    pos: number
    hasAnchor: boolean
  }) => string)
  | string
  showOnlyWhenEditable: boolean
  showOnlyCurrent: boolean
  includeChildren: boolean
}

export const ExtensionPlaceholder = Extension.create<PlaceholderOptions>({
  name: 'placeholder',

  addOptions() {
    return {
      emptyEditorClass: 'is-editor-empty',
      emptyNodeClass: 'is-block-empty',
      placeholder: 'Write something …',
      showOnlyWhenEditable: true,
      showOnlyCurrent: true,
      includeChildren: false,
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: ({ doc, selection }) => {
            const active
              = this.editor.isEditable || !this.options.showOnlyWhenEditable
            const { anchor } = selection
            const decorations: Decoration[] = []

            if (!active) {
              return null
            }

            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize
              const isEmpty = !node.isLeaf && !node.childCount

              if ((hasAnchor || !this.options.showOnlyCurrent) && isEmpty) {
                const classes = [this.options.emptyNodeClass]

                if (this.editor.isEmpty) {
                  classes.push(this.options.emptyEditorClass)
                }

                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  'class': classes.join(' '),
                  'data-placeholder':
                    typeof this.options.placeholder === 'function'
                      ? this.options.placeholder({
                        editor: this.editor,
                        node,
                        pos,
                        hasAnchor,
                      })
                      : this.options.placeholder,
                })

                decorations.push(decoration)
              }

              return this.options.includeChildren
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})
