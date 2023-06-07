<script setup lang="ts">
import { desktop } from '~/plugins/desktop'

function handleMinimize() {
  desktop.window.appWindow.minimize()
}
const maximize = ref(false)
async function handleMaximize() {
  maximize.value = !maximize.value
  if (await desktop.window.appWindow.isMaximized())
    await desktop.window.appWindow.unmaximize()
  else
    await desktop.window.appWindow.maximize()
}
function handleClose() {
  desktop.window.appWindow.hide()
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
