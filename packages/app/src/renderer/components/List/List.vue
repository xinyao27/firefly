<script setup lang="ts">
import type { TreeDropInfo, TreeOption } from 'naive-ui'
import { useContextMenuOptions } from './useContextMenuOptions'
import { useClick } from './useClick'
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
      isLeaf: true,
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
const onClick = useClick()

const nodeProps = ({ option }: { option: TreeOption }) => {
  const block = option.data as Block
  return {
    'data-block-id': block.id,
    onContextmenu(e: MouseEvent) {
      blockStore.currentBlockId = block?.id
      showContextMenu(e, contextMenuOptions)
    },
    onClick(e: MouseEvent) {
      const prevBlockId = blockStore.currentBlockId
      onClick(e, prevBlockId, block)
    },
  }
}
</script>

<template>
  <NTree
    id="block-tree"
    class="h-[calc(100%-22px)]"
    block-line
    block-node
    draggable
    selectable
    :selected-keys="blockStore.selectedBlockIds"
    :expanded-keys="blockStore.expandedBlockIds"
    :data="data"
    :node-props="nodeProps"
    :default-expanded-keys="[data?.[0]?.key ?? '0']"
    @update-expanded-keys="handleUpdatePrefixWithExpanded"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @drop="handleDrop"
  />
</template>
