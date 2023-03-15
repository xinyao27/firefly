<script setup lang="ts">
import RouterTools from './RouterTools.vue'

function handleMouseDown(e: MouseEvent) {
  e.preventDefault()
}

const route = useRoute()
const configStore = useConfigStore()
const blockStore = useBlockStore()
const tagStore = useTagStore()
</script>

<template>
  <div flex items-center gap-1 z-99 w-full h-full px-2 select-none>
    <!-- leftBarShow -->
    <NTooltip
      v-if="configStore.isMobileScreen"
      trigger="hover"
    >
      <template #trigger>
        <NButton
          size="small"
          quaternary
          :opacity="configStore.leftBarShow ? 100 : 40"
          @click="configStore.toggleLeftBarShow"
        >
          <i v-if="!configStore.leftBarShow" i-ri-layout-left-line />
          <i v-else i-ri-layout-left-fill />
        </NButton>
      </template>
      <template v-if="!configStore.leftBarShow">
        展开
      </template>
      <template v-else>
        收起
      </template>
    </NTooltip>
    <!-- Router Tools  -->
    <RouterTools v-if="route.path === '/'" />
    <!-- Drag Area -->
    <div
      flex-auto h-full select-none
      style="-webkit-app-region: drag"
      @mousedown="handleMouseDown"
    />
    <NButton
      size="small"
      quaternary
      :loading="blockStore.syncing"
      @click="() => {
        blockStore.sync()
        tagStore.sync()
      }"
    >
      <template #icon>
        <i i-ri-refresh-line />
      </template>
      同步
    </NButton>
  </div>
</template>
