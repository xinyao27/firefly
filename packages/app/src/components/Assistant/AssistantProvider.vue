<script setup lang="ts">
const assistantStore = useAssistantStore()
const assistantLinkStore = useAssistantLinkStore()
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
        :class="assistantStore.fileList.length > 0 ? 'max-h-60' : 'max-h-80'"
        :pinned="false"
      />
    </div>
  </NModal>
  <NModal
    v-model:show="assistantLinkStore.show"
    :px="isMobileScreen ? 2 : 0"
    transform-origin="center"
    :mask-closable="!isMobileScreen"
  >
    <div mx-auto mt-2 h-full w-2xl lg:mt-13vh>
      <AssistantLink
        v-model="assistantLinkStore.value"
        :pinned="false"
      />
    </div>
  </NModal>
  <slot />
</template>
