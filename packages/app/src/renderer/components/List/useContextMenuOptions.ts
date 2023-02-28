import type { DropdownOption } from 'naive-ui'
import type { ComputedRef } from 'vue'
import type { Block } from '~/models/Block'

export function useContextMenuOptions(): ComputedRef<DropdownOption[]> {
  const blockStore = useBlockStore()
  const blocks = computed(() => {
    return blockStore.selectedBlockIds.map(id => blockStore.blocks.find(v => v.id === id)!)
  })

  return computed(() => {
    return [
      {
        label: '默认应用打开',
        key: 'OPEN_WITH_DEFAULT',
        onClick: async () => {
          async function fn(block: Block) {
            switch (block.category) {
              case 'image':
              case 'other': {
                const path = await $api.getFinalPath(block.path!)
                $api.shellOpenPath(path)
                break
              }
              case 'text': {
                if (block.path) {
                  const path = await $api.getFinalPath(block.path!)
                  $api.shellOpenPath(path)
                }
                break
              }
              case 'link':
                $api.shellOpenExternal(block.link || block.content!)
                break
              case 'rss':
                // TODO
                break
            }
          }
          if (blocks.value.length) {
            try {
              for (const block of blocks.value)
                await fn(block)
            }
            catch (e) {
              $message.error(e)
            }
          }
          else if (blockStore.currentBlock) {
            await fn(blockStore.currentBlock)
          }
        },
      },
      {
        label: '文件资源管理器打开',
        key: 'OPEN_WITH_EXPLORER',
        onClick: async () => {
          if (blocks.value.length) {
            try {
              if (blocks.value.length === 1 && blocks.value[0].path) {
                $api.shellShowItemInFolder(await $api.getFinalPath(blocks.value[0].path))
              }
              else {
                const dirPath = await $api.getFinalPath('files')
                $api.shellOpenPath(dirPath)
              }
            }
            catch (e) {
              $message.error(e)
            }
          }
          else if (blockStore.currentBlock) {
            $api.shellShowItemInFolder(await $api.getFinalPath(blockStore.currentBlock.path))
          }
        },
      },
      {
        type: 'divider',
        key: 'D1',
      },
      {
        label: '复制文件',
        key: 'COPY',
        onClick: async () => {
          if (blocks.value.length) {
            const allPath: string[] = []
            try {
              for (const block of blocks.value) {
                if (block.path) {
                  const path = await $api.getFinalPath(block.path)
                  allPath.push(path)
                }
              }
            }
            catch (e) {
              $message.error(e)
            }
            finally {
              await $api.clipboardWrite({ paths: allPath })
              $message.success(`已复制 ${allPath.length} 个文件`)
            }
          }
          else if (blockStore.currentBlock) {
            if (blockStore.currentBlock.path) {
              const path = await $api.getFinalPath(blockStore.currentBlock.path)
              await $api.clipboardWrite({ paths: [path] })
              $message.success('已复制 1 个文件')
            }
          }
        },
      },
      {
        label: '复制文件路径',
        key: 'COPY_FILE_PATH',
        onClick: async () => {
          if (blocks.value.length) {
            const allPath: string[] = []
            try {
              for (const block of blocks.value) {
                if (block.path) {
                  const path = await $api.getFinalPath(block.path!)
                  allPath.push(path)
                }
              }
            }
            catch (e) {
              $message.error(e)
            }
            finally {
              await $api.clipboardWrite({ texts: allPath })
              $message.success(`已复制 ${allPath.length} 个文件路径`)
            }
          }
          else if (blockStore.currentBlock) {
            if (blockStore.currentBlock.path) {
              const path = await $api.getFinalPath(blockStore.currentBlock.path)
              await $api.clipboardWrite({ texts: [path] })
              $message.success('已复制 1 个文件路径')
            }
          }
        },
      },
      {
        type: 'divider',
        key: 'D2',
      },
      {
        label: '删除',
        key: 'REMOVE',
        onClick: async () => {
          if (blocks.value.length) {
            const trashes = []
            try {
              for (const block of blocks.value) {
                await blockStore.remove(block.id)
                trashes.push(block.id)
              }
            }
            catch (e) {
              $message.error(e)
            }
            finally {
              $message.success(`已删除 ${trashes.length} 个文件`)
            }
          }
          else if (blockStore.currentBlock) {
            await blockStore.remove(blockStore.currentBlock.id)
            $message.success('已删除 1 个文件')
          }
        },
      },
    ] as DropdownOption[]
  })
}
