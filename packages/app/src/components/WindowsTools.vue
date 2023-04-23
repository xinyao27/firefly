<script setup lang="ts">
import { tauri } from '~/plugins/tauri'

function handleMinimize() {
  tauri.window.appWindow.minimize()
}
const maximize = ref(false)
async function handleMaximize() {
  maximize.value = !maximize.value
  if (await tauri.window.appWindow.isMaximized())
    await tauri.window.appWindow.unmaximize()
  else
    await tauri.window.appWindow.maximize()
}
function handleClose() {
  tauri.window.appWindow.hide()
}
</script>

<template>
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
      @click="handleMaximize"
    >
      <i
        v-if="maximize"
        i-ri-checkbox-multiple-blank-line scale-80 transform
      />
      <i
        v-else
        i-ri-checkbox-blank-line scale-80 transform
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
</template>
