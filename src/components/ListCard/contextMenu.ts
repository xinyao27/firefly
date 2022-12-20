import type { DropdownOption } from 'naive-ui'
import { open } from '@tauri-apps/api/shell'
import { appDataDir, join } from '@tauri-apps/api/path'
import { writeText } from '@tauri-apps/api/clipboard'
import type { ComputedRef } from 'vue'
import type { Message } from '~/models/Message'
import { getFinalFilePath } from '~/utils'

export function useContextMenuOptions(messages: ComputedRef<Message[]>): ComputedRef<DropdownOption[]> {
  return computed(() => {
    return [
      {
        label: '默认应用打开',
        key: 'OPEN_WITH_DEFAULT',
        onClick: async() => {
          if (messages.value.length) {
            for (const message of messages.value) {
              const filePath = await getFinalFilePath(message.filePath!)
              open(filePath)
            }
          }
        },
      },
      {
        label: '文件资源管理器打开',
        key: 'OPEN_WITH_EXPLORER',
        onClick: async() => {
          if (messages.value.length) {
            const dirPath = await join(await appDataDir(), 'files')
            open(dirPath)
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
            catch (_) {}
            finally {
              await writeText(allFilePath.join('\n'))
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
          // TODO
            $message.success('已移到废纸篓')
          }
        },
      },
    ] as DropdownOption[]
  })
}
