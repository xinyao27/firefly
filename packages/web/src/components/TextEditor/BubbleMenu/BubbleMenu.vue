<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3'
import type { DropdownOption } from 'naive-ui'
import type { EditorState } from 'prosemirror-state'
import { maskActions } from './actions'

const props = defineProps<{
  editor?: Editor
}>()

const shouldShow = (props: {
  state: EditorState
}) => {
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
    :tippy-options="{ duration: 100 }"
    :should-show="shouldShow"
  >
    <div bg-dark-700 border border-dark-200 shadow-lg rounded>
      <NButtonGroup>
        <template v-for="item in maskActions" :key="item.key">
          <NDropdown v-if="item.options" :options="item.options" @select="handleSelect">
            <NButton
              size="small"
              secondary
              @click="item.onClick?.(props.editor)"
            >
              <template
                v-if="item.prefix"
                #icon
              >
                <component :is="item.prefix" />
              </template>
              <component
                :is="item.title"
                v-if="item.title"
              />
            </NButton>
          </NDropdown>
          <NTooltip v-if="item.description" trigger="hover" :disabled="item.type === 'divider'">
            <template #trigger>
              <NButton
                size="small"
                secondary
                @click="item.onClick?.(props.editor)"
              >
                <template
                  v-if="item.prefix"
                  #icon
                >
                  <component :is="item.prefix" />
                </template>
                <component
                  :is="item.title"
                  v-if="item.title"
                />
              </NButton>
            </template>
            <div>{{ item.description }}</div>
            <div text-gray-400 text-xs flex gap-1>
              <KBD
                v-if="item.shortcut"
                :shortcut="item.shortcut"
              />
            </div>
          </NTooltip>
        </template>
      </NButtonGroup>
    </div>
  </BubbleMenu>
</template>
