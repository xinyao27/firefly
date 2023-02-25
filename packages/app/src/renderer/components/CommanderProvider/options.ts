import type { DropdownOption } from 'naive-ui'

export type ActionType = 'reset' | 'continue' | 'rewrite' | 'translate'
export type ActionOption = DropdownOption & {
  action?: (emit: (e: ActionType) => void) => void
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
    action(emit) {
      emit('translate')
    },
  },
]

/**
 * 回答以后的 options
 */
export const answeredOptions: ActionOption[] = [
  {
    icon: () => h('i', { class: 'i-ri-translate-2' }),
    label: '继续写',
    key: 'continue',
    action(emit) {
      emit('continue')
    },
  },
  {
    icon: () => h('i', { class: 'i-ri-translate-2' }),
    label: '重新写',
    key: 'rewrite',
    action(emit) {
      emit('rewrite')
    },
  },
  {
    icon: () => h('i', { class: 'i-ri-restart-line' }),
    label: '重置',
    key: 'reset',
    action(emit) {
      emit('reset')
    },
  },
]
