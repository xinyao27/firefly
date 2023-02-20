<script setup lang="ts">
import WindowsTools from './WindowsTools.vue'
import RouterTools from './RouterTools.vue'
import SizeSlider from './SizeSlider.vue'
import TextEditorLeftToggleTools from './TextEditorLeftToggleTools.vue'

const showWindowActions = computed(() => $electron.process.platform === 'win32' || $electron.process.platform === 'linux')

function handleMouseDown(e: MouseEvent) {
  e.preventDefault()
}

const alwaysOnTop = ref(false)
function handleToggleSticky() {
  alwaysOnTop.value = !alwaysOnTop.value
  $electron.ipcRenderer.invoke('win:setAlwaysOnTop', alwaysOnTop.value)
}

const route = useRoute()
const configStore = useConfigStore()
function handleToggleLeftBarCollapse() {
  configStore.leftBarCollapsed = !configStore.leftBarCollapsed
}
function handleToggleRightBarCollapse() {
  configStore.rightBarCollapsed = !configStore.rightBarCollapsed
}
</script>

<template>
  <div flex items-center gap-1 z-99 w-full h-full px-2 select-none>
    <!-- placeholder -->
    <div v-if="!showWindowActions" w-14 />
    <!-- leftBarCollapsed -->
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton
          size="small"
          quaternary
          :opacity="configStore.leftBarCollapsed ? 40 : 100"
          @click="handleToggleLeftBarCollapse"
        >
          <i v-if="configStore.leftBarCollapsed" i-ri-layout-left-line />
          <i v-else i-ri-layout-left-fill />
        </NButton>
      </template>
      <template v-if="configStore.leftBarCollapsed">
        展开
      </template>
      <template v-else>
        收起
      </template>
    </NTooltip>
    <!-- 编辑器切换文件列表/搜索 -->
    <TextEditorLeftToggleTools v-if="route.path === '/text-editor'" />
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
    <!-- rightBarCollapsed -->
    <NTooltip trigger="hover">
      <template #trigger>
        <NButton
          size="small"
          quaternary
          :opacity="configStore.rightBarCollapsed ? 40 : 100"
          @click="handleToggleRightBarCollapse"
        >
          <i v-if="configStore.rightBarCollapsed" i-ri-layout-right-line />
          <i v-else i-ri-layout-right-fill />
        </NButton>
      </template>
      <template v-if="configStore.rightBarCollapsed">
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
    <WindowsTools v-if="showWindowActions" />
  </div>
</template>
