import { h } from 'vue'
import type { Action } from '../types'

export const actions: Action[] = [
  {
    key: 'type',
    label: '类型',
    children: [
      {
        key: 'Text',
        label: '正文',
        icon: () => h('i', { class: 'i-ri-text' }),
        onClick(editor) {
          editor?.chain().focus().setMark('text').run()
        },
      },
      {
        key: 'TodoList',
        label: '待办列表',
        icon: () => h('i', { class: 'i-ri-list-check-2' }),
        onClick(editor) {
          editor?.chain().focus().toggleTaskList().run()
        },
      },
      {
        key: 'Ordered List',
        label: '编号列表',
        icon: () => h('i', { class: 'i-ri-list-ordered' }),
        onClick(editor) {
          editor?.chain().focus().toggleOrderedList().run()
        },
      },
      {
        key: 'Bullet List',
        label: '项目列表',
        icon: () => h('i', { class: 'i-ri-list-unordered' }),
        onClick(editor) {
          editor?.chain().focus().toggleBulletList().run()
        },
      },
      {
        key: 'Blockquote',
        label: '引述文字',
        icon: () => h('i', { class: 'i-ri-double-quotes-l' }),
        onClick(editor) {
          editor?.chain().focus().toggleBlockquote().run()
        },
      },
    ],
  },
  { type: 'divider', key: 'd1', label: '' },
  {
    key: 'bold',
    shortcut: ['ctrl', 'b'],
    icon: () => h('i', { class: 'i-ri-bold' }),
    label: '加粗',
    onClick(editor) {
      editor?.chain().focus().toggleBold().run()
    },
  },
  {
    key: 'italic',
    shortcut: ['ctrl', 'i'],
    icon: () => h('i', { class: 'i-ri-italic' }),
    label: '斜体',
    onClick(editor) {
      editor?.chain().focus().toggleItalic().run()
    },
  },
  {
    key: 'underline',
    shortcut: ['ctrl', 'u'],
    icon: () => h('i', { class: 'i-ri-underline' }),
    label: '下划线',
    onClick(editor) {
      editor?.chain().focus().toggleUnderline().run()
    },
  },
  {
    key: 'strike',
    shortcut: ['ctrl', 'shift', 'x'],
    icon: () => h('i', { class: 'i-ri-strikethrough' }),
    label: '中划线',
    onClick(editor) {
      editor?.chain().focus().toggleStrike().run()
    },
  },
  {
    key: 'code',
    shortcut: ['ctrl', 'e'],
    icon: () => h('i', { class: 'i-ri-code-line' }),
    label: '代码',
    onClick(editor) {
      editor?.chain().focus().toggleCode().run()
    },
  },
]
