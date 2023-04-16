<script setup lang="ts">
import { is } from '@firefly/common'

const props = withDefaults(defineProps<{
  shortcut?: string[]
  showIcon?: boolean
}>(), {
  showIcon: true,
})

const shortcut = computed(() => {
  if (!props.shortcut)
    return []
  return props.shortcut.map((_key) => {
    const key = _key.toLowerCase()
    if (is.macOS()) {
      if (key === 'ctrl' || key === 'command')
        return () => h('i', { class: 'i-ri-command-fill text-xs inline-block' })
      if (key === 'shift')
        return () => h('i', { class: 'i-tabler-arrow-big-up text-xs inline-block' })
      if (key === 'alt')
        return '⌥'
      if (key === 'meta')
        return () => h('i', { class: 'i-ri-command-fill text-xs inline-block' })
    }
    return key
  })
})
</script>

<template>
  <div
    v-if="props.shortcut"
    text-neutral-600 bg-neutral-300 px-1 font-mono font-bold leading-normal tracking-wide
    uppercase rounded-sm inline-flex items-center align-middle gap-1
  >
    <i v-if="props.showIcon" i-ri-keyboard-box-fill />
    <kbd flex items-center gap-1>
      <span
        v-for="item in shortcut"
        :key="item as string"
      >
        <template v-if="typeof item === 'function'">
          <component :is="item" />
        </template>
        <template v-else>
          {{ item }}
        </template>
      </span>
    </kbd>
  </div>
</template>
