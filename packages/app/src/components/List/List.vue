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
const isMobileScreen = useMobileScreen()
</script>

<template>
  <div>
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
      v-if="isMobileScreen"
      class="round fixed bottom-40px w-[calc(100vw-42px)] capitalize shadow-lg"
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
      v-if="isMobileScreen"
      :bottom="100"
      :right="24"
      :listen-to="() => configStore.containerRef"
    >
      <i i-ri-skip-up-line />
    </NBackTop>
  </div>
</template>
