<script setup lang="ts">
import { tauri } from '~/plugins/tauri'

const { t } = useI18n()

const pinned = ref(false)
async function handleTogglePin() {
  const value = await tauri.invoke<boolean>('set_assistant_window_always_on_top')
  pinned.value = value
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
