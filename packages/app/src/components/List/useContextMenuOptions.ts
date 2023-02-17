import type { DropdownOption } from 'naive-ui'
import { shell } from 'electron'
import type { ComputedRef } from 'vue'
import { clipboardWrite } from '~~/utils'
import { getFinalFilePath } from '~/utils'

export function useContextMenuOptions(): ComputedRef<DropdownOption[]> {
  const messageStore = useMessageStore()
  const messages = computed(() => {
    return messageStore.selectedMessageIds.map(id => messageStore.messages.find(v => v.id === id)!)
  })

  return computed(() => {
    return [
      {
        label: '默认应用打开',
        key: 'OPEN_WITH_DEFAULT',
        onClick: async() => {
          if (messages.value.length) {
            try {
              for (const message of messages.value) {
                switch (message.category) {
                  case 'image':
                  case 'other': {
                    const filePath = await getFinalFilePath(message.filePath!)
                    shell.openPath(filePath)
                    break
                  }
                  case 'text': {
                    if (message.filePath) {
                      const filePath = await getFinalFilePath(message.filePath!)
                      shell.openPath(filePath)
                    }
                    break
                  }
                  case 'link':
                    shell.openExternal(message.link || message.content!)
                    break
                  case 'rss':
                    // TODO
                    break
                }
              }
            }
            catch (e) {
              $message.error(e)
            }
          }
        },
      },
      {
        label: '文件资源管理器打开',
        key: 'OPEN_WITH_EXPLORER',
        onClick: async() => {
          if (messages.value.length) {
            try {
              if (messages.value.length === 1 && messages.value[0].filePath) {
                shell.showItemInFolder(await getFinalFilePath(messages.value[0].filePath))
              }
              else {
                const dirPath = await getFinalFilePath('files')
                shell.openPath(dirPath)
              }
            }
            catch (e) {
              $message.error(e)
            }
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
        onClick: async() => {
          if (messages.value.length) {
            const allFilePath = []
            try {
              for (const message of messages.value) {
                if (message.filePath) {
                  const filePath = await getFinalFilePath(message.filePath)
                  allFilePath.push(filePath)
                }
              }
            }
            catch (e) {
              $message.error(e)
            }
            finally {
              await clipboardWrite({ filePaths: allFilePath })
              $message.success(`已复制 ${allFilePath.length} 个文件`)
            }
          }
        },
      },
      {
        label: '复制文件路径',
        key: 'COPY_FILE_PATH',
        onClick: async() => {
          if (messages.value.length) {
            const allFilePath = []
            try {
              for (const message of messages.value) {
                if (message.filePath) {
                  const filePath = await getFinalFilePath(message.filePath!)
                  allFilePath.push(filePath)
                }
              }
            }
            catch (e) {
              $message.error(e)
            }
            finally {
              await clipboardWrite({ texts: allFilePath })
              $message.success(`已复制 ${allFilePath.length} 个文件路径`)
            }
          }
        },
      },
      {
        type: 'divider',
        key: 'D2',
      },
      {
        label: '移到废纸篓',
        key: 'MOVE_TO_TRASH',
        onClick: async() => {
          if (messages.value.length) {
            const trashes = []
            try {
              for (const message of messages.value) {
                await messageStore.moveToTrash(message.id)
                trashes.push(message.id)
              }
            }
            catch (e) {
              $message.error(e)
            }
            finally {
              $message.success(`已将 ${trashes.length} 个文件移到废纸篓`)
            }
          }
        },
      },
    ] as DropdownOption[]
  })
}
