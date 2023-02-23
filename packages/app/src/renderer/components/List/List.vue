<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
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

// const nodeProps = ({ option }: { option: TreeOption }) => {
//   return {
//     onDrop(e: DragEvent) {
//       console.log(e.dataTransfer?.files, e.dataTransfer?.getData('text'))
//     },
//   }
// }
</script>

<template>
  <div
    w-full h-full
    draggable="false"
  >
    <NTree
      class="h-full"
      virtual-scroll
      block-line
      expand-on-click
      draggable
      selectable
      cascade
      :data="data"
      @update:selected-keys="handleSelect"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    />
  </div>
</template>
