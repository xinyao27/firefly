import type { Editor, Range } from '@tiptap/core'
import type { DropdownOption } from 'naive-ui'

export type Action = DropdownOption & {
  type?: 'divider'
  label: string
  key: string
  description?: string
  shortcut?: string[]
  onClick?: (editor?: Editor, range?: Range) => void
  children?: Action[]
}
