import type { Editor, Range } from '@tiptap/core'

export interface CommandItem {
  title: string
  description: string
  type: string
  icon: string
  command: (params: { editor: Editor; range: Range }) => void
  shortcut?: string
}
export const commands: CommandItem[] = [
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    type: 'h1',
    icon: 'i-ri-h-1',
    command: ({ editor, range }) => {
      editor?.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
    },
    shortcut: '#',
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    type: 'h2',
    icon: 'i-ri-h-2',
    command: ({ editor, range }) => {
      editor?.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
    },
    shortcut: '##',
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    type: 'h3',
    icon: 'i-ri-h-3',
    command: ({ editor, range }) => {
      editor?.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
    },
    shortcut: '###',
  },
  {
    title: 'TodoList',
    description: '待办列表',
    type: 'ol',
    icon: 'i-ri-list-check-2',
    command: ({ editor, range }) => {
      editor?.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    title: 'Ordered List',
    description: 'Create a list with numbering.',
    type: 'ol',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
    icon: 'i-ri-list-ordered',
    shortcut: '1. L',
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bulleted list.',
    type: 'ul',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
    icon: 'i-ri-list-unordered',
    shortcut: '- L',
  },
  {
    title: 'Blockquote',
    description: 'Capture a quote.',
    type: 'blockquote',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setBlockquote().run()
    },
    icon: 'i-ri-double-quotes-l',
    shortcut: '>',
  },
  {
    title: 'Code Block',
    description: 'Capture a code snippet.',
    type: 'code-block',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCodeBlock({ language: 'auto' }).run()
    },
    icon: 'i-ri-code-box-line',
    shortcut: '```',
  },
]
