<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3'
import type { DropdownOption } from 'naive-ui'
import { NButton, NButtonGroup, NDropdown, NTooltip } from 'naive-ui'
import type { EditorState } from '@tiptap/pm/state'
import { useTextEditorState } from '../state'
import { actions } from './actions'

const props = defineProps<{
  editor?: Editor
}>()
const state = useTextEditorState()

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
    :tippy-options="{ duration: 100, appendTo: state.root.value }"
    :should-show="shouldShow"
  >
    <div bg-white shadow-lg rounded>
      <NButtonGroup>
        <template v-for="item in actions" :key="item.key">
          <NDropdown v-if="item.children" :options="item.children" @select="handleSelect">
            <NButton
              size="small"
              secondary
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
          <NTooltip v-else :disabled="item.type === 'divider'">
            <template #trigger>
              <NButton
                size="small"
                secondary
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
      </NButtonGroup>
    </div>
  </BubbleMenu>
</template>
