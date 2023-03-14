import type { Editor } from '@tiptap/core'
import type { DropdownOption } from 'naive-ui'
import type { VNodeChild } from 'vue'

interface Action {
  type?: 'divider'
  key: string
  title?: () => VNodeChild
  prefix?: () => VNodeChild
  description?: string
  options?: (DropdownOption & Action)[]
  shortcut?: string[]
  onClick?: (editor?: Editor) => void
}

export const maskActions: Action[] = [
  {
    key: 'type',
    title: () => '类型',
    options: [
      {
        key: 'Text',
        label: '正文',
        icon: () => h('i', { class: 'i-ri-bold' }),
        onClick(editor) {
          editor?.chain().focus().setMark('text').run()
        },
      },
      {
        key: 'Heading 1',
        label: '标题 1',
        icon: () => h('i', { class: 'i-ri-h-1' }),
        onClick(editor) {
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        },
      },
      {
        key: 'Heading 2',
        label: '标题 2',
        icon: () => h('i', { class: 'i-ri-h-1' }),
        onClick(editor) {
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        },
      },
      {
        key: 'Heading 3',
        label: '标题 3',
        icon: () => h('i', { class: 'i-ri-h-1' }),
        onClick(editor) {
          editor?.chain().focus().toggleHeading({ level: 3 }).run()
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
    key: 'italic',
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
    key: 'strike',
    shortcut: ['ctrl', 'shift', 'x'],
    prefix: () => h('i', { class: 'i-ri-strikethrough' }),
    description: '中划线',
    onClick(editor) {
      editor?.chain().focus().toggleStrike().run()
    },
  },
  {
    key: 'code',
    shortcut: ['ctrl', 'e'],
    prefix: () => h('i', { class: 'i-ri-code-line' }),
    description: '代码',
    onClick(editor) {
      editor?.chain().focus().toggleCode().run()
    },
  },
]
