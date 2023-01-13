<script setup lang="ts">
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
</script>

<template>
  <div flex items-center gap-1 z-99 w-full h-full px-2 select-none>
    <!-- Router Tools  -->
    <RouterTools />
    <!-- Drag Area -->
    <div
      flex-auto h-full
      style="-webkit-app-region: drag"
      @mousedown="handleMouseDown"
    />
    <!-- Common Tools -->
    <CardSizeSlider />
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
    <NDivider vertical />
    <!-- Windows Tools -->
    <div z-100 transition-opacity>
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
