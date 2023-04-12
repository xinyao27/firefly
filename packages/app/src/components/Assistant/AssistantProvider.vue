<script setup lang="ts">
const assistantStore = useAssistantStore()
const isMobileScreen = useMobileScreen()
</script>

<template>
  <NModal
    v-model:show="assistantStore.show"
    :px="isMobileScreen ? 2 : 0"
    transform-origin="center"
    :mask-closable="!isMobileScreen"
  >
    <div w-2xl mx-auto mt-2 lg:mt-13vh h-full>
      <Assistant
        v-model="assistantStore.value"
        class="max-h-80 shadow-none"
        :pinned="false"
      />
    </div>
  </NModal>
  <slot />
</template>
