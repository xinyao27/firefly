import { h } from 'vue'
import type { Action } from '../../types'

export const actions: Action[] = [
  {
    key: 'todoList',
    label: 'TodoList',
    description: '待办列表',
    icon: () => h('i', { class: 'i-ri-list-check-2' }),
    onClick: (editor, range) => {
      editor?.chain().focus().deleteRange(range!).toggleTaskList().run()
    },
  },
  {
    key: 'orderedList',
    label: 'Ordered List',
    description: 'Create a list with numbering.',
    onClick: (editor, range) => {
      editor?.chain().focus().deleteRange(range!).toggleOrderedList().run()
    },
    icon: () => h('i', { class: 'i-ri-list-ordered' }),
    shortcut: ['1. L'],
  },
  {
    key: 'bulletList',
    label: 'Bullet List',
    description: 'Create a simple bulleted list.',
    onClick: (editor, range) => {
      editor?.chain().focus().deleteRange(range!).toggleBulletList().run()
    },
    icon: () => h('i', { class: 'i-ri-list-unordered' }),
    shortcut: ['- L'],
  },
  {
    key: 'blockquote',
    label: 'Blockquote',
    description: 'Capture a quote.',
    onClick: (editor, range) => {
      editor?.chain().focus().deleteRange(range!).setBlockquote().run()
    },
    icon: () => h('i', { class: 'i-ri-double-quotes-l' }),
    shortcut: ['>'],
  },
  {
    key: 'code',
    label: 'Code Block',
    description: 'Capture a code snippet.',
    onClick: (editor, range) => {
      editor?.chain().focus().deleteRange(range!).setCodeBlock({ language: 'auto' }).run()
    },
    icon: () => h('i', { class: 'i-ri-code-box-line' }),
    shortcut: ['```'],
  },
]
