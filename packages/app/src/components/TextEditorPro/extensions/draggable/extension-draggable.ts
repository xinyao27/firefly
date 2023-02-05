import { Extension } from '@tiptap/core'
import type { EditorView } from 'prosemirror-view'
// @ts-expect-error noop
import { __serializeForClipboard } from 'prosemirror-view'
import type { Selection } from 'prosemirror-state'
import { NodeSelection, Plugin, PluginKey } from 'prosemirror-state'
import { } from 'prosemirror-model'
import { getNodeAtPos } from '../../utils'
import type { ActiveNode } from './utils'
import { removePossibleTable, selectRootNodeByDom } from './utils'

export const ExtensionDraggable = Extension.create({
  name: 'draggable',

  addProseMirrorPlugins() {
    let editorView: EditorView
    let dragHandleDOM: HTMLElement
    let activeNode: ActiveNode
    let activeSelection: Selection | null
    let dragging = false

    const createDragHandleDOM = () => {
      const dom = document.createElement('div')
      dom.draggable = true
      dom.setAttribute('data-drag-handle', 'true')
      dom.classList.add('drag-handle')
      const icon = document.createElement('div')
      icon.classList.add('i-ri-drag-move-line')
      dom.appendChild(icon)
      return dom
    }

    const showDragHandleDOM = () => {
      dragHandleDOM.classList.add('show')
      dragHandleDOM.classList.remove('hide')
    }

    const hideDragHandleDOM = () => {
      dragHandleDOM.classList.remove('show')
      dragHandleDOM.classList.add('hide')
    }

    const renderDragHandleDOM = (view: EditorView, el: HTMLElement) => {
      const root = view.dom.parentElement

      if (!root) return

      while (el && el.parentElement) {
        if (el.parentElement.classList.contains('ProseMirror')) {
          break
        }
        el = el.parentElement
      }

      const targetNodeRect = el.getBoundingClientRect()
      const rootRect = root.getBoundingClientRect()
      const handleRect = dragHandleDOM.getBoundingClientRect()

      const left
        = targetNodeRect.left
        - rootRect.left
        - handleRect.width
      const top
        = targetNodeRect.top
        - rootRect.top
        + handleRect.height
        + root.scrollTop

      dragHandleDOM.style.left = `${left - 4}px`
      dragHandleDOM.style.top = `${top - 2}px`

      showDragHandleDOM()
    }

    const handleMouseDown = () => {
      if (!activeNode) return null

      if (NodeSelection.isSelectable(activeNode.node)) {
        const nodeSelection = NodeSelection.create(
          editorView.state.doc,
          activeNode.$pos.pos - activeNode.offset,
        )
        editorView.dispatch(editorView.state.tr.setSelection(nodeSelection))
        editorView.focus()
        activeSelection = nodeSelection
        return nodeSelection
      }

      return null
    }

    const handleMouseUp = () => {
      if (!dragging) return

      dragging = false
      activeSelection = null
    }

    const handleDragStart = (event: DragEvent) => {
      dragging = true
      if (event.dataTransfer && activeSelection) {
        const slice = activeSelection.content()
        event.dataTransfer.effectAllowed = 'copyMove'
        const { dom, text } = __serializeForClipboard(editorView, slice)
        event.dataTransfer.clearData()
        event.dataTransfer.setData('text/html', dom.innerHTML)
        event.dataTransfer.setData('text/plain', text)
        editorView.dragging = {
          slice,
          move: true,
        }
      }
    }

    return [
      new Plugin({
        key: new PluginKey('draggable'),
        view: (view) => {
          if (view.editable) {
            dragHandleDOM = createDragHandleDOM()
            dragHandleDOM.addEventListener('mousedown', handleMouseDown)
            dragHandleDOM.addEventListener('mouseup', handleMouseUp)
            dragHandleDOM.addEventListener('dragstart', handleDragStart)
            view.dom.parentNode?.appendChild(dragHandleDOM)
          }

          return {
            update(view) {
              editorView = view
            },
            destroy: () => {
              if (!dragHandleDOM) return

              dragHandleDOM.removeEventListener('mousedown', handleMouseDown)
              dragHandleDOM.removeEventListener('mouseup', handleMouseUp)
              dragHandleDOM.removeEventListener('dragstart', handleDragStart)
              dragHandleDOM.remove()
            },
          }
        },
        props: {
          handleDOMEvents: {
            drop: (view, event: DragEvent) => {
              if (!view.editable || !dragHandleDOM) return false

              const eventPos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              })
              if (!eventPos) {
                return true
              }

              const $mouse = view.state.doc.resolve(eventPos.pos)

              /**
               * 不允许在 title 处放置
               */
              if ($mouse?.parent?.type?.name === 'title') {
                return true
              }

              if (dragging) {
                const tr = removePossibleTable(view, event)
                dragging = false
                if (tr) {
                  view.dispatch(tr)
                  event.preventDefault()
                  return true
                }
              }

              return false
            },
            mousemove: (view, event) => {
              if (!view.editable || !dragHandleDOM) return false

              const dom = event.target

              if (!(dom instanceof Element)) {
                if (dragging) return false
                hideDragHandleDOM()
                return false
              }

              const result = selectRootNodeByDom(dom, view)

              if (
                !result
                || result.node.type.name === 'doc'
                || result.node.type.name === 'title'
                || result.node.type.name === 'tableOfContents'
                || result.node.type.name === 'column'
                // empty paragraph
                || (result.node.type.name === 'paragraph'
                  && result.node.nodeSize === 2)
              ) {
                if (dragging) return false
                hideDragHandleDOM()
                return false
              }

              /**
               * 嵌套在其他节点的 paragraph
               */
              if (result.node.type.name === 'paragraph') {
                const { $from, to } = view.state.selection
                const same = $from.sharedDepth(to)
                if (same !== 0) {
                  const pos = $from.before(same)
                  const parent = getNodeAtPos(view.state, pos)

                  if (parent && parent.type.name !== 'paragraph') {
                    if (dragging) return false
                    hideDragHandleDOM()
                    return false
                  }
                }
              }

              activeNode = result

              renderDragHandleDOM(view, result.el)
              return false
            },
            keydown: () => {
              if (!editorView.editable || !dragHandleDOM) return false
              hideDragHandleDOM()
              return false
            },
          },
        },
      }),
    ]
  },
})
