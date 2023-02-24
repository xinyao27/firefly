<script setup lang="ts">
import type { TreeDropInfo, TreeOption } from 'naive-ui'
import type { Message } from '~/models/Message'

const messageStore = useMessageStore()
function getIconByMessageCategory(message: Message) {
  switch (message.category) {
    case 'folder':
      return () => h('i', { class: 'i-ri-folder-fill' })
    case 'article':
      return () => h('i', { class: 'i-ri-article-fill' })
    case 'image':
      return () => h('i', { class: 'i-ri-image-fill' })
    case 'link':
      return () => h('i', { class: 'i-ri-link' })
    case 'rss':
      return () => h('i', { class: 'i-ri-rss-fill' })
    default:
      return () => h('i', { class: 'i-ri-file-3-fill' })
  }
}
function createData(messages: Message[]): TreeOption[] {
  return messages.map((message) => {
    if (message.children && message.children.length) {
      return {
        data: message,
        label: message.title,
        key: message.id,
        prefix: getIconByMessageCategory(message),
        children: createData(message.children),
      }
    }
    return {
      data: message,
      label: message.title,
      key: message.id,
      prefix: getIconByMessageCategory(message),
    }
  })
}
const data = computed(() => createData(messageStore.messages))

function handleDragStart({ node }: { event: DragEvent; node: TreeOption }) {
  const message = node.data as Message
  messageStore.draggingMessage = message
}
function handleDragEnd() {
  messageStore.draggingMessage = null
}

function handleSelect(
  value: Array<string & number>,
  _: any,
  meta: {
    node: TreeOption | null
    action: 'select' | 'unselect'
  },
) {
  if (meta.action === 'unselect') return
  if (meta.node?.category === 'folder') return

  messageStore.selectMessageIds(value)
  messageStore.currentMessageId = meta.node?.key as string
}

function findSiblingsAndIndex(
  node: TreeOption,
  nodes?: TreeOption[],
): [TreeOption[], number] | [null, null] {
  if (!nodes) return [null, null]
  for (let i = 0; i < nodes.length; ++i) {
    const siblingNode = nodes[i]
    if (siblingNode.key === node.key) return [nodes, i]
    const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children)
    if (siblings && index !== null) return [siblings, index]
  }
  return [null, null]
}
function handleDrop({ node, dragNode, dropPosition }: TreeDropInfo) {
  const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
    dragNode,
    data.value,
  )
  if (dragNodeSiblings === null || dragNodeIndex === null) return
  dragNodeSiblings.splice(dragNodeIndex, 1)
  if (dropPosition === 'inside') {
    if (node.children) {
      node.children.unshift(dragNode)
    }
    else {
      node.children = [dragNode]
    }
  }
  else if (dropPosition === 'before') {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
      node,
      data.value,
    )
    if (nodeSiblings === null || nodeIndex === null) return
    nodeSiblings.splice(nodeIndex, 0, dragNode)
  }
  else if (dropPosition === 'after') {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
      node,
      data.value,
    )
    if (nodeSiblings === null || nodeIndex === null) return
    nodeSiblings.splice(nodeIndex + 1, 0, dragNode)
  }
}
</script>

<template>
  <NTree
    class="h-[calc(100%-22px)]"
    block-line
    expand-on-click
    draggable
    selectable
    :data="data"
    @update:selected-keys="handleSelect"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @drop="handleDrop"
  />
</template>
