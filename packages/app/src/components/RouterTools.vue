<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()
const navigateBackDisabled = computed(() => route.path === '/')
// @ts-expect-error noop
const navigateForwardDisabled = computed(() => router.routeHistory.at(-1)?.path === route.path)

function handleNavigateBack() {
  router.back()
}
function handleNavigateForward() {
  router.forward()
}
</script>

<template>
  <div flex items-center gap-2>
    <NButton
      size="tiny"
      quaternary
      :disabled="navigateBackDisabled"
      @click="handleNavigateBack"
    >
      <i i-ri-arrow-left-line />
    </NButton>
    <NButton
      size="tiny"
      quaternary
      :disabled="navigateForwardDisabled"
      @click="handleNavigateForward"
    >
      <i i-ri-arrow-right-line />
    </NButton>
    <NText v-if="configStore.title.length" code style="-webkit-app-region: drag">
      {{ configStore.title }}
    </NText>
  </div>
</template>
