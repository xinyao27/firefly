<script setup lang="ts">
import is from 'electron-is'
import { ipcRenderer } from 'electron'

function handleMouseDown(e: MouseEvent) {
  e.preventDefault()
}
function handleMinimize() {
  ipcRenderer.invoke('win:minimize')
}
const maximize = ref(false)
function handleToggleMaximize() {
  ipcRenderer.invoke('win:toggleMaximize')
  maximize.value = !maximize.value
}
function handleClose() {
  ipcRenderer.invoke('win:close')
}
const alwaysOnTop = ref(false)
function handleToggleSticky() {
  alwaysOnTop.value = !alwaysOnTop.value
  ipcRenderer.invoke('win:setAlwaysOnTop', alwaysOnTop.value)
}
const showWindowActions = computed(() => is.windows() || is.linux())

const route = useRoute()
const configStore = useConfigStore()
function handleToggleSearchBarCollapse() {
  configStore.searchBarCollapsed = !configStore.searchBarCollapsed
}
function handleToggleDetailBarCollapse() {
  configStore.detailBarCollapsed = !configStore.detailBarCollapsed
}
function handleToggleListMode() {
  if (configStore.listMode === 'cardList') {
    configStore.listMode = 'rowList'
  }
  else {
    configStore.listMode = 'cardList'
  }
}
</script>

<template>
  <div flex items-center gap-1 z-99 w-full h-full px-2 select-none>
    <!-- placeholder -->
    <div v-if="!showWindowActions" w-14 />
    <!-- searchBarCollapsed -->
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton
          size="small"
          quaternary
          :opacity="configStore.searchBarCollapsed ? 40 : 100"
          @click="handleToggleSearchBarCollapse"
        >
          <i v-if="configStore.searchBarCollapsed" i-ri-layout-left-line />
          <i v-else i-ri-layout-left-fill />
        </NButton>
      </template>
      <template v-if="configStore.searchBarCollapsed">
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
    <!-- Common Tools -->
    <SizeSlider v-if="route.path === '/'" />
    <!-- 主页切换 卡片/列表 -->
    <NTooltip
      v-if="route.path === '/'"
      trigger="hover"
    >
      <template #trigger>
        <NButton
          size="small"
          quaternary
          opacity-40
          @click="handleToggleListMode"
        >
          <i v-if="configStore.listMode === 'cardList'" i-ri-layout-top-line />
          <i v-if="configStore.listMode === 'rowList'" i-ri-layout-grid-line />
        </NButton>
      </template>
      <template v-if="configStore.listMode === 'cardList'">
        列表模式
      </template>
      <template v-if="configStore.listMode === 'rowList'">
        卡片模式
      </template>
    </NTooltip>
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton
          size="small"
          quaternary
          :opacity="alwaysOnTop ? 100 : 40 "
          @click="handleToggleSticky"
        >
          <i v-if="alwaysOnTop" i-ri-pushpin-2-line />
          <i v-else i-ri-pushpin-line />
        </NButton>
      </template>
      <template v-if="alwaysOnTop">
        关闭窗口总是在最上方
      </template>
      <template v-else>
        窗口总是在最上方
      </template>
    </NTooltip>
    <!-- detailBarCollapsed -->
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton
          size="small"
          quaternary
          :opacity="configStore.detailBarCollapsed ? 40 : 100"
          @click="handleToggleDetailBarCollapse"
        >
          <i v-if="configStore.detailBarCollapsed" i-ri-layout-right-line />
          <i v-else i-ri-layout-right-fill />
        </NButton>
      </template>
      <template v-if="configStore.detailBarCollapsed">
        展开
      </template>
      <template v-else>
        收起
      </template>
    </NTooltip>
    <NDivider
      v-if="showWindowActions"
      vertical
    />
    <!-- Windows/Linux Tools -->
    <div
      v-if="showWindowActions"
      z-100 transition-opacity
    >
      <NButton
        size="small"
        quaternary
        @click="handleMinimize"
      >
        <i i-ri-subtract-line />
      </NButton>
      <NButton
        size="small"
        quaternary
        @click="handleToggleMaximize"
      >
        <i
          v-if="maximize"
          transform scale-80 i-ri-checkbox-multiple-blank-line
        />
        <i
          v-else
          transform scale-80 i-ri-checkbox-blank-line
        />
      </NButton>
      <NButton
        style="--n-color-hover: #ef4444"
        size="small"
        quaternary
        @click="handleClose"
      >
        <i i-ri-close-line />
      </NButton>
    </div>
  </div>
</template>
