<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import { colors } from '@firefly/common'
import Bubble from './Bubble.vue'

const props = withDefaults(
  defineProps<{
    class?: string
    color?: keyof typeof colors
  }>(),
  {
    color: 'slate',
  },
)
const emit = defineEmits(['select'])

function handleSelect(color: string) {
  emit('select', color)
}
const options = Object.keys(colors).map(v => ({
  key: v,
  label: v,
}))
function renderIcon(option: DropdownOption) {
  return h(
    Bubble,
    {
      color: option.key,
    },
  )
}
</script>

<template>
  <NDropdown
    placement="bottom-start"
    :options="options"
    trigger="click"
    size="small"
    :render-icon="renderIcon"
    @select="handleSelect"
  >
    <NButton
      quaternary
      size="tiny"
      @click.stop=""
    >
      <Bubble
        :class="props.class"
        :color="props.color"
      />
    </NButton>
  </NDropdown>
</template>
