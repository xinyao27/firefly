<script setup lang="ts">
import type { TreeDropInfo, TreeOption } from 'naive-ui'
import { useContextMenuOptions } from './useContextMenuOptions'
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
      suffix: message.fileExt ? () => h('div', { class: 'bg-neutral-700 bg-opacity-60 text-xs font-semibold scale-80 px-1 rounded select-none' }, message.fileExt?.toUpperCase()) : undefined,
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

const handleUpdatePrefixWithExpanded = (
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null
    action: 'expand' | 'collapse' | 'filter'
  },
) => {
  if (!meta.node) return
  switch (meta.action) {
    case 'expand':
      meta.node.prefix = () => h('i', { class: 'i-ri-folder-5-fill' })
      break
    case 'collapse':
      meta.node.prefix = () => h('i', { class: 'i-ri-folder-fill' })
      break
  }
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
  messageStore.currentMessageId = (meta.node?.data as Message)?.id as string
}

async function handleDrop({ node, dragNode, dropPosition }: TreeDropInfo) {
  if (dropPosition === 'inside') {
    await messageStore.move((node.data as Message)?.id, (dragNode.data as Message)?.id)
  }
  else {
    // 拖拽到根目录
    if (!(node.data as Message).parent) {
      await messageStore.move('0', (dragNode.data as Message)?.id)
    }
  }
}

const contextMenuOptions = useContextMenuOptions()
const { show: showContextMenu } = useContextMenu(contextMenuOptions.value)
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onContextmenu(e: MouseEvent) {
      messageStore.currentMessageId = (option.data as Message)?.id
      nextTick(() => {
        showContextMenu(e)
      })
    },
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
    :node-props="nodeProps"
    :default-expanded-keys="[data?.[0]?.key ?? '0']"
    @update-expanded-keys="handleUpdatePrefixWithExpanded"
    @update:selected-keys="handleSelect"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @drop="handleDrop"
  />
</template>
