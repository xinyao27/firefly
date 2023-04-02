<script setup lang="ts">
import MasonryWall from '@yeger/vue-masonry-wall'
import type { BlockModel } from '@firefly/common'
import ListItem from './ListItem.vue'

const props = defineProps<{
  data: BlockModel[]
}>()

const { t } = useI18n()
const configStore = useConfigStore()
const textEditorStore = useTextEditorStore()

const containerRef = ref<HTMLElement>()
</script>

<template>
  <div
    ref="containerRef"
    h-full p-4 overflow-x-hidden overflow-y-auto
  >
    <MasonryWall :items="props.data" :ssr-columns="1" :column-width="300" :gap="16">
      <template #default="{ item }">
        <ListItem
          :key="item.id"
          :data="item"
        />
      </template>
    </MasonryWall>
    <NButton
      v-if="configStore.isMobileScreen"
      class="w-[calc(100vw-42px)] round fixed bottom-40px shadow-lg capitalize"
      size="large"
      color="rgb(135, 206, 235)"
      round
      @click="textEditorStore.open('create')"
    >
      <template #icon>
        <i i-ri-pencil-fill />
      </template>
      {{ t('block.create') }}
    </NButton>
    <NBackTop
      v-if="configStore.isMobileScreen"
      :bottom="100"
      :right="24"
      :listen-to="() => containerRef"
    >
      <i i-ri-skip-up-line />
    </NBackTop>
  </div>
</template>
