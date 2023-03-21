<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
</script>

<template>
  <ThemeProvider>
    <CustomProvider>
      <RouterView />
    </CustomProvider>
  </ThemeProvider>
</template>
