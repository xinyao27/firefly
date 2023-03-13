<script setup lang="ts">
import MasonryWall from '@yeger/vue-masonry-wall'
import ListItem from './ListItem.vue'

const blockStore = useBlockStore()
</script>

<template>
  <div p-4 overflow-x-hidden overflow-y-auto>
    <MasonryWall :items="blockStore.blocks" :ssr-columns="1" :column-width="300" :gap="16">
      <template #default="{ item }">
        <ListItem
          :key="item.id"
          :data="item"
        />
      </template>
    </MasonryWall>
  </div>
</template>
