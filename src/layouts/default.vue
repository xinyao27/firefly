<script setup lang="ts">
const configsStore = useConfigsStore()
</script>

<template>
  <main
    h-screen text-gray-700 dark:text-gray-200 flex flex-col
    :style="{ paddingTop: `${configsStore.rootPaddingTop}px` }"
  >
    <DragProvider>
      <RouterView />
    </DragProvider>
  </main>
</template>
