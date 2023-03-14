import type { Editor } from '@tiptap/core'
import type { DropdownOption } from 'naive-ui'

export type Action = DropdownOption & {
  type?: 'divider'
  key: string
  shortcut?: string[]
  onClick?: (editor?: Editor) => void
  children?: Action[]
}
