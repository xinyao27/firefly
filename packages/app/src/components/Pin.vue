<script setup lang="ts">
import { desktop } from '~/plugins/desktop'

const { t } = useI18n()

const pinned = ref(false)
async function handleTogglePin() {
  await desktop.ipcRenderer.invoke('windows:setAssistantWindowAlwaysOnTop', !pinned.value)
  pinned.value = !pinned.value
}
</script>

<template>
  <NTooltip trigger="hover">
    <template #trigger>
      <NButton
        size="tiny"
        quaternary
        :opacity="pinned ? 100 : 40 "
        @click="handleTogglePin"
      >
        <i v-if="pinned" i-ri-pushpin-2-line />
        <i v-else i-ri-pushpin-line />
      </NButton>
    </template>
    <template v-if="pinned">
      {{ t('assistant.unpin') }}
    </template>
    <template v-else>
      {{ t('assistant.pin') }}
    </template>
  </NTooltip>
</template>
