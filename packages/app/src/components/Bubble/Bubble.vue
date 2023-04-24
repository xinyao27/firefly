<script setup lang="ts">
import { colors } from '@firefly/common'

const props = defineProps<{
  class?: string
  color?: keyof typeof colors
}>()

const color = computed(() => props.color || 'slate')
</script>

<template>
  <i
    inline-block h-2 w-2 rounded-full
    :bg="color"
    :class="props.class"
    :style="{
      backgroundColor: colors[color],
    }"
  />
</template>
