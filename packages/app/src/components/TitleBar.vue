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
  <div fixed left-0 top-0 flex items-center z-99 w-full h-8 pl-4 select-none>
    <CardSizeSlider />
    <div
      flex-auto h-full
      style="-webkit-app-region: drag"
      @mousedown="handleMouseDown"
    />
    <div z-100 transition-opacity>
      <NTooltip trigger="hover" :show-arrow="false">
        <template #trigger>
          <div
            w-10 h-8 inline-flex justify-center items-center opacity-40 hover:(bg-dark-300 opacity-100)
            :opacity="alwaysOnTop ? 100 : 40 "
            @click="handleToggleSticky"
          >
            <i v-if="alwaysOnTop" i-ri-pushpin-2-line />
            <i v-else i-ri-pushpin-line />
          </div>
        </template>
        <template v-if="alwaysOnTop">
          关闭窗口总是在最上方
        </template>
        <template v-else>
          窗口总是在最上方
        </template>
      </NTooltip>
      <div
        w-10 h-8 inline-flex justify-center items-center opacity-40 hover:(bg-dark-300 opacity-100)
        @click="handleMinimize"
      >
        <i i-ri-subtract-line />
      </div>
      <div
        w-10 h-8 inline-flex justify-center items-center opacity-40 hover:(bg-dark-300 opacity-100)
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
      </div>
      <div
        w-10 h-8 inline-flex justify-center items-center opacity-40 hover:(bg-red-500 opacity-100)
        @click="handleClose"
      >
        <i i-ri-close-line />
      </div>
    </div>
  </div>
</template>
