<script setup lang="ts">
import MasonryWall from '@yeger/vue-masonry-wall'
import type { BlockModel } from '@firefly/common'
import ListItem from './ListItem.vue'

const props = defineProps<{
  data: BlockModel[]
}>()
</script>

<template>
  <div h-full p-4 overflow-x-hidden overflow-y-auto>
    <MasonryWall :items="props.data" :ssr-columns="1" :column-width="300" :gap="16">
      <template #default="{ item }">
        <ListItem
          :key="item.id"
          :data="item"
        />
      </template>
    </MasonryWall>
  </div>
</template>
