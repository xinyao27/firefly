<script setup lang="ts">
import View from './View.vue'
import Selector from './Selector.vue'

const props = withDefaults(
  defineProps<{
    name: string
    color: 'dark' | 'default' | 'light' | 'medium' | 'medium-dark' | 'medium-light'
    selector?: boolean
    hoverable?: boolean
  }>(),
  {
    name: 'grinning-face',
    color: 'default',
    selector: false,
    hoverable: true,
  },
)
const emit = defineEmits(['select'])

function handleSelect(name: string) {
  emit('select', name)
}
</script>

<template>
  <View
    v-if="!props.selector"
    :name="props.name"
    :color="props.color"
    :hoverable="props.hoverable"
  />
  <Selector
    v-else
    :name="props.name"
    :color="props.color"
    :hoverable="props.hoverable"
    @select="handleSelect"
  />
</template>
