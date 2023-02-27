import type { DropdownOption } from 'naive-ui'

export type ActionType = 'reset' | 'continue' | 'rewrite' | 'translate'
export type ActionOption = DropdownOption & {
  action?: () => void
}

export const initialOptions: ActionOption[] = []

/**
 * 选中文字以后的 options
 */
export const selectedOptions: ActionOption[] = [
  {
    icon: () => h('i', { class: 'i-ri-translate-2' }),
    label: '翻译',
    key: 'translate',
    action() {
      // const commanderStore = useCommanderStore()
      // commanderStore.translate()
    },
  },
]

/**
 * 回答以后的 options
 */
export const answeredOptions: ActionOption[] = [
  {
    icon: () => h('i', { class: 'i-ri-edit-2-line' }),
    label: '继续写',
    key: 'continue',
    action() {
      const commanderStore = useCommanderStore()
      commanderStore.continue()
    },
  },
  {
    icon: () => h('i', { class: 'i-ri-pencil-line' }),
    label: '重新写',
    key: 'rewrite',
    action() {
      const commanderStore = useCommanderStore()
      commanderStore.rewrite()
    },
  },
  {
    icon: () => h('i', { class: 'i-ri-restart-line' }),
    label: '重置',
    key: 'reset',
    action() {
      const commanderStore = useCommanderStore()
      commanderStore.reset()
    },
  },
]

export const articleOptions: ActionOption[] = [
  {
    icon: () => h('i', { class: 'i-ri-send-plane-line' }),
    label: '插入到当前文章中',
    key: 'insert-into-article',
    action() {
      const textEditorStore = useTextEditorStore()
      const commanderStore = useCommanderStore()
      const content = `<p>${commanderStore.results.trim()}</p>`
      commanderStore.show = false
      commanderStore.reset()
      nextTick(() => {
        textEditorStore.insertContent(content)
      })
    },
  },
]
