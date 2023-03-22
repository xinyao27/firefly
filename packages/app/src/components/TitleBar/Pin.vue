<script setup lang="ts">
import { is } from '@firefly/common'
import { invoke } from '@tauri-apps/api'

const pinned = ref(false)
async function handleTogglePin() {
  const value = await invoke<boolean>('set_main_window_always_on_top')
  pinned.value = value
}
</script>

<template>
  <NTooltip trigger="hover">
    <template #trigger>
      <NButton
        size="small"
        quaternary
        :opacity="pinned ? 100 : 40 "
        @click="handleTogglePin"
      >
        <i v-if="pinned" i-ri-pushpin-2-line />
        <i v-else i-ri-pushpin-line />
      </NButton>
    </template>
    <template v-if="pinned">
      关闭窗口总是在最上方
    </template>
    <template v-else>
      窗口总是在最上方
    </template>
  </NTooltip>
  <NDivider
    v-if="is.isWindows()"
    vertical
  />
</template>
