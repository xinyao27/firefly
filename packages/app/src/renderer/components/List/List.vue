<script setup lang="ts">
import type { TreeDropInfo, TreeOption } from 'naive-ui'
import { useContextMenuOptions } from './useContextMenuOptions'
import type { Block } from '~/models/Block'

const blockStore = useBlockStore()
function getIconByBlockCategory(block: Block) {
  switch (block.category) {
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
function createData(blocks: Block[]): TreeOption[] {
  return blocks.map((block) => {
    if (block.children && block.children.length) {
      return {
        data: block,
        label: block.title,
        key: block.id,
        prefix: getIconByBlockCategory(block),
        children: createData(block.children),
      }
    }
    return {
      data: block,
      label: block.title,
      key: block.id,
      prefix: getIconByBlockCategory(block),
      suffix: block.fileExt ? () => h('div', { class: 'bg-neutral-700 bg-opacity-60 text-xs font-semibold scale-80 px-1 rounded select-none' }, block.fileExt?.toUpperCase()) : undefined,
    }
  })
}
const data = computed(() => createData(blockStore.blocks))

function handleDragStart({ node }: { event: DragEvent; node: TreeOption }) {
  const block = node.data as Block
  blockStore.draggingBlock = block
}
function handleDragEnd() {
  blockStore.draggingBlock = null
}

const handleUpdatePrefixWithExpanded = (
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null
    action: 'expand' | 'collapse' | 'filter'
  },
) => {
  if (!meta.node)
    return
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
  if (meta.action === 'unselect')
    return
  if (meta.node?.category === 'folder')
    return

  blockStore.selectBlockIds(value)
  blockStore.currentBlockId = (meta.node?.data as Block)?.id as string
}

async function handleDrop({ node, dragNode, dropPosition }: TreeDropInfo) {
  if (dropPosition === 'inside') {
    await blockStore.move((node.data as Block)?.id, (dragNode.data as Block)?.id)
  }
  else {
    // 拖拽到根目录
    if (!(node.data as Block).parent)
      await blockStore.move('0', (dragNode.data as Block)?.id)
  }
}

const contextMenuOptions = useContextMenuOptions()
const { show: showContextMenu } = useContextMenu()
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onContextmenu(e: MouseEvent) {
      blockStore.currentBlockId = (option.data as Block)?.id
      showContextMenu(e, contextMenuOptions)
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
