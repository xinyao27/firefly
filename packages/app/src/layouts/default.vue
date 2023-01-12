<script setup lang="ts">
const configStore = useConfigStore()
</script>

<template>
  <main
    h-screen text-gray-700 dark:text-gray-200 flex flex-col px-4
    :style="{ paddingTop: `${configStore.rootPaddingTop}px` }"
  >
    <RouterView />
  </main>
</template>
