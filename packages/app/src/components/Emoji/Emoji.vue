<script setup lang="ts">
import View from './View.vue'
import Selector from './Selector.vue'

const props = withDefaults(
  defineProps<{
    name: string
    color: 'dark' | 'default' | 'light' | 'medium' | 'medium-dark' | 'medium-light'
    selector?: boolean
  }>(),
  {
    name: 'abacus', // TODO 替换掉
    color: 'default',
    selector: false,
  },
)
</script>

<template>
  <View
    v-if="!props.selector"
    :name="props.name"
    :color="props.color"
  />
  <Selector
    v-else
    :name="props.name"
    :color="props.color"
  />
</template>
