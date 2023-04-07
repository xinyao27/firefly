<script setup lang="ts">
import type { BlockModel } from '@firefly/common'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import ListItem from './ListItem.vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const props = defineProps<{
  data: BlockModel[]
}>()

const { t } = useI18n()
const configStore = useConfigStore()
const assistantStore = useAssistantStore()

const containerRef = ref<HTMLElement>()
</script>

<template>
  <div
    ref="containerRef"
    h-full p-4 overflow-x-hidden overflow-y-auto
  >
    <DynamicScroller
      :items="props.data"
      :min-item-size="80"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[
            item.content,
          ]"
          :data-index="index"
        >
          <div pb-4>
            <ListItem
              :data="item"
            />
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
    <NButton
      v-if="configStore.isMobileScreen"
      class="w-[calc(100vw-42px)] round fixed bottom-40px shadow-lg capitalize"
      size="large"
      color="rgb(135, 206, 235)"
      round
      @click="assistantStore.open('create')"
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
