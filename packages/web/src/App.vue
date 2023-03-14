<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
</script>

<template>
  <ThemeProvider>
    <ContextMenuProvider>
      <CustomProvider>
        <RouterView />
      </CustomProvider>
    </ContextMenuProvider>
  </ThemeProvider>
</template>
