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
    <div mx-auto mt-2 h-full w-2xl lg:mt-13vh>
      <Assistant
        v-model="assistantStore.value"
        class="max-h-80 shadow-none"
        :pinned="false"
      />
    </div>
  </NModal>
  <slot />
</template>
