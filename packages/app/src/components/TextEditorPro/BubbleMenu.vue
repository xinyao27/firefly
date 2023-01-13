<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3'

interface Action {
  name: string
  shortcut: string[]
  icon: string
  onClick: () => void
}

const props = defineProps<{
  editor?: Editor
}>()

const actions: Action[] = [
  {
    name: 'Bold',
    shortcut: ['Ctrl', 'B'],
    icon: 'i-ri-bold',
    onClick() {
      props.editor?.chain().focus().toggleBold().run()
    },
  },
  {
    name: 'Italicize',
    shortcut: ['Ctrl', 'I'],
    icon: 'i-ri-italic',
    onClick() {
      props.editor?.chain().focus().toggleItalic().run()
    },
  },
  {
    name: 'Underline',
    shortcut: ['Ctrl', 'U'],
    icon: 'i-ri-underline',
    onClick() {
      props.editor?.chain().focus().toggleUnderline().run()
    },
  },
  {
    name: 'Strike through',
    shortcut: ['Ctrl', 'Shift', 'X'],
    icon: 'i-ri-strikethrough',
    onClick() {
      props.editor?.chain().focus().toggleStrike().run()
    },
  },
  {
    name: 'Mark as code',
    shortcut: ['Ctrl', 'E'],
    icon: 'i-ri-code-line',
    onClick() {
      props.editor?.chain().focus().toggleCode().run()
    },
  },
]
</script>

<template>
  <BubbleMenu
    v-if="props.editor"
    :editor="props.editor"
    :tippy-options="{ duration: 100 }"
  >
    <div bg-dark-700 border border-dark-200 shadow-lg rounded>
      <NButtonGroup>
        <NTooltip v-for="item in actions" :key="item.name" trigger="hover">
          <template #trigger>
            <NButton

              size="small"
              secondary
              @click="item.onClick"
            >
              <i :class="item.icon" />
            </NButton>
          </template>
          <div>{{ item.name }}</div>
          <div text-gray-400 text-xs flex gap-1>
            <kbd
              v-for="s in item.shortcut" :key="s"
              text-gray-600 bg-gray-400 px-1 font-mono font-bold leading-normal tracking-wide uppercase rounded text-xs
            >
              {{ s }}
            </kbd>
          </div>
        </NTooltip>
      </NButtonGroup>
    </div>
  </BubbleMenu>
</template>
