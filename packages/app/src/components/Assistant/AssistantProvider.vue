<script setup lang="ts">
const assistantStore = useAssistantStore()
const configStore = useConfigStore()
</script>

<template>
  <NModal
    v-model:show="assistantStore.show"
    class="px-2"
    transform-origin="center"
    :mask-closable="!configStore.isMobileScreen"
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
