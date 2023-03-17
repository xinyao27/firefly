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
      // const textEditorStore = useTextEditorStore()
      // textEditorStore.translate()
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
      const textEditorStore = useTextEditorStore()
      textEditorStore.continue()
    },
  },
  {
    icon: () => h('i', { class: 'i-ri-pencil-line' }),
    label: '重新写',
    key: 'rewrite',
    action() {
      const textEditorStore = useTextEditorStore()
      textEditorStore.rewrite()
    },
  },
  {
    icon: () => h('i', { class: 'i-ri-restart-line' }),
    label: '重置',
    key: 'reset',
    action() {
      const textEditorStore = useTextEditorStore()
      textEditorStore.reset()
    },
  },
]
