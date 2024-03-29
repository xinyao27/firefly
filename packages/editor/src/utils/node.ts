import type { Editor } from '@tiptap/core'
import type { EditorState, NodeSelection } from '@tiptap/pm/state'
import type { Node } from '@tiptap/pm/model'

export function getCurrentNode(state: EditorState): Node | null {
  const $head = state.selection.$head
  let node: Node | null = null

  for (let d = $head.depth; d > 0; d--)
    node = $head.node(d)

  return node
}

export function getNodeAtPos(state: EditorState, pos: number): Node | null {
  const $head = state.doc.resolve(pos)
  let node: Node | null = null

  for (let d = $head.depth; d > 0; d--)
    node = $head.node(d)

  return node
}

export function isNodeActive(editor: Editor, extensionName: string): boolean {
  const selection = editor.state.selection
  const node
    = ((selection as unknown) as NodeSelection)?.node
    || selection.$head.node(selection.$head.depth)

  return node
    ? node.type.name === extensionName
    : editor.isActive(extensionName)
}

export function isInCustomNode(state: EditorState, nodeName: string): boolean {
  if (!state.schema.nodes[nodeName])
    return false

  const $head = state.selection.$head
  for (let d = $head.depth; d > 0; d--) {
    if ($head.node(d).type === state.schema.nodes[nodeName])
      return true
  }
  return false
}

export function isInCodeBlock(state: EditorState): boolean {
  return isInCustomNode(state, 'codeBlock')
}

export function isInTitle(state: EditorState): boolean {
  if (state?.selection?.$head?.pos === 0)
    return true
  return isInCustomNode(state, 'title')
}

export function isInCallout(state: EditorState): boolean {
  return isInCustomNode(state, 'callout')
}

export function isTitleNode(node: Node): boolean {
  return node && node.type.name === 'title'
}

export function isBulletListNode(node: Node): boolean {
  return node && node.type.name === 'bulletList'
}

export function isOrderedListNode(node: Node): boolean {
  return node && node.type.name === 'orderedList'
}

export function isTodoListNode(node: Node): boolean {
  return node && node.type.name === 'taskList'
}

export function isListNode(node: Node): boolean {
  return (
    isBulletListNode(node) || isOrderedListNode(node) || isTodoListNode(node)
  )
}

export function findNodeByBlockId(state: EditorState,
  nodeType: string,
  blockId: string): { node: Node; pos: number } | null {
  let target: Node | null = null
  let pos = -1

  state.doc.nodesBetween(0, state.doc.content.size, (node, p) => {
    if (node.type.name === nodeType) {
      if (node.attrs.blockId === blockId) {
        target = node
        pos = p
        return true
      }

      return false
    }
    else {
      return false
    }
  })

  return target ? { node: target, pos } : null
}

export function isNodeEmpty(node: Node) {
  if (node.isAtom && !node.isTextblock)
    return false

  return node.type.name === 'paragraph' && node.nodeSize === 2
}
