<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import { CONTEXT_MENU_KEY } from '~/keys'

const initialState = {
  open: false,
  position: {
    x: 0,
    y: 0,
  },
  options: [],
}
const open = ref(initialState.open)
const position = ref(initialState.position)
const options = ref<DropdownOption[]>(initialState.options)

// @ts-expect-error noop
provide(CONTEXT_MENU_KEY, { open, position, options })

function handleClickOutside() {
  open.value = false
}
function handleSelect(_: any, option: DropdownOption) {
  open.value = false;
  (option.onClick as () => void)?.()
}
</script>

<template>
  <slot />

  <NDropdown
    placement="bottom-start"
    trigger="manual"
    size="small"
    :x="position.x"
    :y="position.y"
    :options="options"
    :show="open"
    @clickoutside="handleClickOutside"
    @select="handleSelect"
  />
</template>
