<script setup lang="ts">
const isMobileScreen = useMobileScreen()
const pricingStore = usePricingStore()
</script>

<template>
  <NModal
    v-model:show="pricingStore.show"
    :px="isMobileScreen ? 2 : 0"
    transform-origin="center"
    :mask-closable="!isMobileScreen"
  >
    <Pricing />
  </NModal>
  <slot />
</template>
