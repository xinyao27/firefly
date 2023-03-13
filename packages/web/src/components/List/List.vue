<script setup lang="ts">
import ListItem from './ListItem.vue'

const blockStore = useBlockStore()
</script>

<template>
  <div flex flex-col gap-4>
    <ListItem
      v-for="block in blockStore.blocks"
      :key="block.id"
      :data="block"
    />
  </div>
</template>
