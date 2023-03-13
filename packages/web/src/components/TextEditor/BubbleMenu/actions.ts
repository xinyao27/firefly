import type { Editor } from '@tiptap/core'
import type { VNodeChild } from 'vue'
import type { DropdownOption } from 'naive-ui'

interface Action {
  type?: 'divider'
  key: string
  title?: () => VNodeChild
  prefix?: () => VNodeChild
  description?: string
  options?: DropdownOption[]
  shortcut?: string[]
  onClick?: (editor?: Editor) => void
}

export const maskActions: Action[] = [
  { type: 'divider', key: 'd1' },
  {
    key: 'bold',
    shortcut: ['ctrl', 'b'],
    prefix: () => h('i', { class: 'i-ri-bold' }),
    description: '加粗',
    onClick(editor) {
      editor?.chain().focus().toggleBold().run()
    },
  },
  {
    key: 'italicize',
    shortcut: ['ctrl', 'i'],
    prefix: () => h('i', { class: 'i-ri-italic' }),
    description: '斜体',
    onClick(editor) {
      editor?.chain().focus().toggleItalic().run()
    },
  },
  {
    key: 'underline',
    shortcut: ['ctrl', 'u'],
    prefix: () => h('i', { class: 'i-ri-underline' }),
    description: '下划线',
    onClick(editor) {
      editor?.chain().focus().toggleUnderline().run()
    },
  },
  {
    key: 'strike through',
    shortcut: ['ctrl', 'shift', 'x'],
    prefix: () => h('i', { class: 'i-ri-strikethrough' }),
    description: '中划线',
    onClick(editor) {
      editor?.chain().focus().toggleStrike().run()
    },
  },
  {
    key: 'mark as code',
    shortcut: ['ctrl', 'e'],
    prefix: () => h('i', { class: 'i-ri-code-line' }),
    description: '代码',
    onClick(editor) {
      editor?.chain().focus().toggleCode().run()
    },
  },
]
