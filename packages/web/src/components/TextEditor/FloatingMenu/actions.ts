import type { Action } from '../types'

export const actions: Action[] = [
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
]
