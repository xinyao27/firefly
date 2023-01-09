import { join } from 'node:path'
import type { DropdownOption } from 'naive-ui'
import { clipboard, shell } from 'electron'
import type { ComputedRef } from 'vue'
import { getAppDataPath } from '~/api'
import { getFinalFilePath } from '~/utils'

export function useContextMenuOptions(): ComputedRef<DropdownOption[]> {
  const messagesStore = useMessagesStore()
  const messages = computed(() => {
    return messagesStore.selectedMessageIds.map(id => messagesStore.messages.find(v => v.id === id)!)
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
                const filePath = await getFinalFilePath(message.filePath!)
                shell.openPath(filePath)
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
              const dirPath = join(await getAppDataPath(), 'files')
              shell.openPath(dirPath)
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
        key: 'COPY_FILE',
        onClick: async() => {
          if (messages.value.length) {
            // for (const message of messages.value) {
            //   // TODO
            //   if (message.filePath) {
            //     const filePath = await getFinalFilePath(message.filePath)
            //     await writeText(filePath)
            //     $message.success('已复制文件')
            //   }
            // }
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
                const filePath = await getFinalFilePath(message.filePath!)
                allFilePath.push(filePath)
              }
            }
            catch (e) {
              $message.error(e)
            }
            finally {
              await clipboard.writeText(allFilePath.join('\n'))
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
                await messagesStore.moveToTrash(message.id)
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
