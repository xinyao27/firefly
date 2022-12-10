<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'

function handleMouseDown(e: MouseEvent) {
  e.preventDefault()
}
function handleMinimize() {
  appWindow.minimize()
}
function handleClose() {
  appWindow.close()
}
const alwaysOnTop = ref(false)
function handleToggleSticky() {
  alwaysOnTop.value = !alwaysOnTop.value
  appWindow.setAlwaysOnTop(alwaysOnTop.value)
}
</script>

<template>
  <div fixed left-0 top-0 flex z-9999 w-full h-8 select-none>
    <div
      flex-1
      data-tauri-drag-region
      @mousedown="handleMouseDown"
    />
    <div z-10000 transition-opacity>
      <NTooltip trigger="hover" :show-arrow="false">
        <template #trigger>
          <div
            w-10 h-8 inline-flex justify-center items-center hover:(bg-dark opacity-100)
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
        w-10 h-8 inline-flex justify-center items-center opacity-40 hover:(bg-dark opacity-100)
        @click="handleMinimize"
      >
        <i i-ri-subtract-line />
      </div>
      <div
        w-10 h-8 inline-flex justify-center items-center color-gray-600
      >
        <i i-ri-checkbox-blank-line />
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
