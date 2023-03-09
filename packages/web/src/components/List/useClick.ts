import type { Block, BlockId } from '~/models/Block'

export function useClick() {
  const blockStore = useBlockStore()
  function onClick(e: MouseEvent, prevBlockId: BlockId | null, block: Block) {
    const blockId = block?.id
    if (prevBlockId !== blockId) {
      if (e.ctrlKey) {
        blockStore.selectBlockIds([...blockStore.selectedBlockIds, blockId])
      }
      else if (e.shiftKey) {
        if (prevBlockId && blockId) {
          const root = document.querySelector('#block-tree')
          const ids = Array.from(root?.querySelectorAll<HTMLElement>('.n-tree-node[data-block-id]') ?? []).map(node => node.dataset.blockId)
          const prevBlockIndex = ids.findIndex(id => id === prevBlockId)
          const blockIndex = ids.findIndex(id => id === blockId)
          const selectedBlockIds = ids.slice(Math.min(prevBlockIndex, blockIndex), Math.max(prevBlockIndex, blockIndex) + 1)
          blockStore.selectBlockIds(selectedBlockIds as string[])
        }
      }
      else {
        blockStore.selectBlockIds([blockId])
        blockStore.currentBlockId = blockId
      }
    }
    if (block?.category === 'folder' && (!e.ctrlKey && !e.shiftKey)) {
      if (blockStore.expandedBlockIds.includes(blockId))
        blockStore.expandedBlockIds = blockStore.expandedBlockIds.filter(id => id !== blockId)
      else
        blockStore.expandedBlockIds.push(blockId)
    }
  }
  return onClick
}
