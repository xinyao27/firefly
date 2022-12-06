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
</script>

<template>
  <div fixed left-0 top-0 flex z-9999 w-full h-8 select-none>
    <div
      flex-1
      data-tauri-drag-region
      @mousedown="handleMouseDown"
    />
    <div z-10000 transition-opacity>
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
