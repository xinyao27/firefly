import type { DropdownOption } from 'naive-ui'
import type { ComputedRef } from 'vue'
import type { Message } from '~/models/Message'

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
          async function fn(message: Message) {
            switch (message.category) {
              case 'image':
              case 'other': {
                const path = await $api.getFinalPath(message.path!)
                $api.shellOpenPath(path)
                break
              }
              case 'text': {
                if (message.path) {
                  const path = await $api.getFinalPath(message.path!)
                  $api.shellOpenPath(path)
                }
                break
              }
              case 'link':
                $api.shellOpenExternal(message.link || message.content!)
                break
              case 'rss':
                // TODO
                break
            }
          }
          if (messages.value.length) {
            try {
              for (const message of messages.value) {
                await fn(message)
              }
            }
            catch (e) {
              $message.error(e)
            }
          }
          else if (messageStore.currentMessage) {
            await fn(messageStore.currentMessage)
          }
        },
      },
      {
        label: '文件资源管理器打开',
        key: 'OPEN_WITH_EXPLORER',
        onClick: async() => {
          if (messages.value.length) {
            try {
              if (messages.value.length === 1 && messages.value[0].path) {
                $api.shellShowItemInFolder(await $api.getFinalPath(messages.value[0].path))
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
          else if (messageStore.currentMessage) {
            $api.shellShowItemInFolder(await $api.getFinalPath(messageStore.currentMessage.path))
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
            const allPath: string[] = []
            try {
              for (const message of messages.value) {
                if (message.path) {
                  const path = await $api.getFinalPath(message.path)
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
          else if (messageStore.currentMessage) {
            if (messageStore.currentMessage.path) {
              const path = await $api.getFinalPath(messageStore.currentMessage.path)
              await $api.clipboardWrite({ paths: [path] })
              $message.success('已复制 1 个文件')
            }
          }
        },
      },
      {
        label: '复制文件路径',
        key: 'COPY_FILE_PATH',
        onClick: async() => {
          if (messages.value.length) {
            const allPath: string[] = []
            try {
              for (const message of messages.value) {
                if (message.path) {
                  const path = await $api.getFinalPath(message.path!)
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
          else if (messageStore.currentMessage) {
            if (messageStore.currentMessage.path) {
              const path = await $api.getFinalPath(messageStore.currentMessage.path)
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
        onClick: async() => {
          if (messages.value.length) {
            const trashes = []
            try {
              for (const message of messages.value) {
                await messageStore.remove(message.id)
                trashes.push(message.id)
              }
            }
            catch (e) {
              $message.error(e)
            }
            finally {
              $message.success(`已删除 ${trashes.length} 个文件`)
            }
          }
          else if (messageStore.currentMessage) {
            await messageStore.remove(messageStore.currentMessage.id)
            $message.success('已删除 1 个文件')
          }
        },
      },
    ] as DropdownOption[]
  })
}
