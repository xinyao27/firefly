<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3'
import type { DropdownOption } from 'naive-ui'
import { NButton, NDropdown, NTooltip } from 'naive-ui'
import type { EditorState } from '@tiptap/pm/state'
import { h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTextEditorState } from '../state'
import type { Action } from '../types'

const props = defineProps<{
  editor?: Editor
}>()
const { t } = useI18n()
const state = useTextEditorState()

const actions: Action[] = [
  {
    key: 'type',
    label: t('editor.type'),
    children: [
      {
        key: 'Text',
        label: t('editor.text'),
        icon: () => h('i', { class: 'i-ri-text' }),
        onClick(editor) {
          editor?.chain().focus().setMark('text').run()
        },
      },
      {
        key: 'TodoList',
        label: t('editor.todoList'),
        icon: () => h('i', { class: 'i-ri-list-check-2' }),
        onClick(editor) {
          editor?.chain().focus().toggleTaskList().run()
        },
      },
      {
        key: 'Ordered List',
        label: t('editor.orderedList'),
        icon: () => h('i', { class: 'i-ri-list-ordered' }),
        onClick(editor) {
          editor?.chain().focus().toggleOrderedList().run()
        },
      },
      {
        key: 'Bullet List',
        label: t('editor.bulletList'),
        icon: () => h('i', { class: 'i-ri-list-unordered' }),
        onClick(editor) {
          editor?.chain().focus().toggleBulletList().run()
        },
      },
      {
        key: 'Blockquote',
        label: t('editor.blockquote'),
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
    label: t('editor.bold'),
    onClick(editor) {
      editor?.chain().focus().toggleBold().run()
    },
  },
  {
    key: 'italic',
    shortcut: ['ctrl', 'i'],
    icon: () => h('i', { class: 'i-ri-italic' }),
    label: t('editor.italic'),
    onClick(editor) {
      editor?.chain().focus().toggleItalic().run()
    },
  },
  {
    key: 'underline',
    shortcut: ['ctrl', 'u'],
    icon: () => h('i', { class: 'i-ri-underline' }),
    label: t('editor.underline'),
    onClick(editor) {
      editor?.chain().focus().toggleUnderline().run()
    },
  },
  {
    key: 'strike',
    shortcut: ['ctrl', 'shift', 'x'],
    icon: () => h('i', { class: 'i-ri-strikethrough' }),
    label: t('editor.strike'),
    onClick(editor) {
      editor?.chain().focus().toggleStrike().run()
    },
  },
  {
    key: 'code',
    shortcut: ['ctrl', 'e'],
    icon: () => h('i', { class: 'i-ri-code-line' }),
    label: t('editor.code'),
    onClick(editor) {
      editor?.chain().focus().toggleCode().run()
    },
  },
]

function shouldShow(props: {
  state: EditorState
}) {
  // @ts-expect-error noop
  return !props.state.selection.node && !props.state.selection.empty
}

function handleSelect(_: string, option: DropdownOption) {
  (option.onClick as (editor?: Editor) => void)?.(props.editor)
}
</script>

<template>
  <BubbleMenu
    v-if="props.editor"
    :editor="props.editor"
    :tippy-options="{ duration: 100, appendTo: state.root.value }"
    :should-show="shouldShow"
  >
    <div class="bg-neutral-800 border border-(slate opacity-5) shadow-lg rounded-sm overflow-hidden flex items-center">
      <template v-for="item in actions" :key="item.key">
        <NDropdown v-if="item.children" :options="item.children" @select="handleSelect">
          <NButton
            class="rounded-0"
            size="small"
            quaternary
            :type="props.editor.isActive(item.key) ? 'primary' : 'default'"
            @click="item.onClick?.(props.editor)"
          >
            <template
              v-if="item.icon"
              #icon
            >
              <component :is="item.icon" />
            </template>
            {{ item.label }}
          </NButton>
        </NDropdown>
        <template v-else-if="item.type === 'divider'">
          <NDivider vertical />
        </template>
        <NTooltip v-else>
          <template #trigger>
            <NButton
              class="rounded-0"
              size="small"
              quaternary
              :type="props.editor.isActive(item.key) ? 'primary' : 'default'"
              @click="item.onClick?.(props.editor)"
            >
              <template
                v-if="item.icon"
                #icon
              >
                <component :is="item.icon" />
              </template>
            </NButton>
          </template>
          <div>{{ item.label }}</div>
          <div text-gray-400 text-xs flex gap-1>
            <KBD
              v-if="item.shortcut"
              :shortcut="item.shortcut"
            />
          </div>
        </NTooltip>
      </template>
    </div>
  </BubbleMenu>
</template>
