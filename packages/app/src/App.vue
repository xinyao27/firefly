<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
</script>

<template>
  <ThemeProvider>
    <ContextMenuProvider>
      <CustomProvider>
        <SearchProvider>
          <RouterView />
        </SearchProvider>
      </CustomProvider>
    </ContextMenuProvider>
  </ThemeProvider>
</template>
