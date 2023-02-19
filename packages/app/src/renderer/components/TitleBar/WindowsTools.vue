<script setup lang="ts">
function handleMinimize() {
  window.$electron.ipcRenderer.invoke('win:minimize')
}
const maximize = ref(false)
function handleToggleMaximize() {
  window.$electron.ipcRenderer.invoke('win:toggleMaximize')
  maximize.value = !maximize.value
}
function handleClose() {
  window.$electron.ipcRenderer.invoke('win:close')
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
</template>
