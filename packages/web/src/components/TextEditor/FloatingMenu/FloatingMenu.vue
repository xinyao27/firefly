<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { FloatingMenu } from '@tiptap/vue-3'
import { actions } from './actions'

const props = defineProps<{
  editor?: Editor
}>()
</script>

<template>
  <FloatingMenu
    v-if="props.editor"
    :editor="props.editor"
    :tippy-options="{ duration: 100, offset: [0, 350] }"
  >
    <NButtonGroup>
      <template v-for="item in actions" :key="item.key">
        <NTooltip v-if="item.label" trigger="hover">
          <template #trigger>
            <NButton
              size="tiny"
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
    </NButtonGroup>
  </FloatingMenu>
</template>
