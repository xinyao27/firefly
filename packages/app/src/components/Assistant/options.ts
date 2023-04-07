import type { DropdownOption } from 'naive-ui'

export type ActionType = 'reset' | 'continue' | 'rewrite' | 'translate'
export type ActionOption = DropdownOption & {
  action?: () => void
}

export const initialOptions: ActionOption[] = []
