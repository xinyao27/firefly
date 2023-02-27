import type { Editor } from '@tiptap/core'
import type { VNodeChild } from 'vue'
import type { DropdownOption } from 'naive-ui'

function getTranslateOptions() {
  const map = [
    {
      key: 'Chinese',
      label: '中文',
    },
    {
      key: 'English',
      label: '英语',
    },
    {
      key: 'Korean',
      label: '韩语',
    },
    {
      key: 'Japanese',
      label: '日语',
    },
    {
      key: 'Spanish',
      label: '西班牙语',
    },
    {
      key: 'Russian',
      label: '俄语',
    },
    {
      key: 'French',
      label: '法语',
    },
    {
      key: 'Portuguese',
      label: '葡萄牙语',
    },
    {
      key: 'German',
      label: '德语',
    },
    {
      key: 'Italian',
      label: '意大利语',
    },
    {
      key: 'Dutch',
      label: '荷兰语',
    },
  ]
  return map.map(v => ({
    key: v.key,
    label: v.label,
    onClick(editor?: Editor) {
      const commanderStore = useCommanderStore()
      const text = editor?.commands.getTextSelection()
      commanderStore.openAndSearch({
        type: 'translate',
        text,
        language: v.key,
      })
    },
  }))
}

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
  {
    key: 'ai',
    title: () => h('div', null, 'Firefly AI'),
    prefix: () => h('i', { class: 'i-tabler-brain' }),
    options: [
      {
        key: 'translate',
        label: '翻译',
        icon: () => h('i', { class: 'i-ri-translate-2' }),
        children: getTranslateOptions(),
      },
      {
        key: 'summarize',
        label: '总结',
        icon: () => h('i', { class: 'i-tabler-float-left' }),
        onClick(editor?: Editor) {
          const commanderStore = useCommanderStore()
          const text = editor?.commands.getTextSelection()
          commanderStore.openAndSearch({
            type: 'summarize',
            text,
          })
        },
      },
      {
        key: 'improveWriting',
        label: '改善内容',
        icon: () => h('i', { class: 'i-ri-magic-line' }),
        onClick(editor?: Editor) {
          const commanderStore = useCommanderStore()
          const text = editor?.commands.getTextSelection()
          commanderStore.openAndSearch({
            type: 'improveWriting',
            text,
          })
        },
      },
      {
        key: 'fixSpellingAndGrammar',
        label: '修复拼写 & 语法错误',
        icon: () => h('i', { class: 'i-ri-check-line' }),
        onClick(editor?: Editor) {
          const commanderStore = useCommanderStore()
          const text = editor?.commands.getTextSelection()
          commanderStore.openAndSearch({
            type: 'fixSpellingAndGrammar',
            text,
          })
        },
      },
    ],
    shortcut: ['Ctrl', '/'],
    onClick() {
    },
  },
  { type: 'divider', key: 'd1' },
  {
    key: 'bold',
    shortcut: ['Ctrl', 'B'],
    prefix: () => h('i', { class: 'i-ri-bold' }),
    description: '加粗',
    onClick(editor) {
      editor?.chain().focus().toggleBold().run()
    },
  },
  {
    key: 'italicize',
    shortcut: ['Ctrl', 'I'],
    prefix: () => h('i', { class: 'i-ri-italic' }),
    description: '斜体',
    onClick(editor) {
      editor?.chain().focus().toggleItalic().run()
    },
  },
  {
    key: 'underline',
    shortcut: ['Ctrl', 'U'],
    prefix: () => h('i', { class: 'i-ri-underline' }),
    description: '下划线',
    onClick(editor) {
      editor?.chain().focus().toggleUnderline().run()
    },
  },
  {
    key: 'strike through',
    shortcut: ['Ctrl', 'Shift', 'X'],
    prefix: () => h('i', { class: 'i-ri-strikethrough' }),
    description: '中划线',
    onClick(editor) {
      editor?.chain().focus().toggleStrike().run()
    },
  },
  {
    key: 'mark as code',
    shortcut: ['Ctrl', 'E'],
    prefix: () => h('i', { class: 'i-ri-code-line' }),
    description: '代码',
    onClick(editor) {
      editor?.chain().focus().toggleCode().run()
    },
  },
]
