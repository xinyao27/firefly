import type { Editor, Range } from '@tiptap/core'

export interface CommandItem {
  title: string
  description?: string
  type: string
  icon: string
  command: (params: { editor: Editor; range: Range }) => void
  shortcut?: string
}
export const commands: CommandItem[] = []
