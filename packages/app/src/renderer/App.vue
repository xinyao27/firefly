<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
</script>

<template>
  <ThemeProvider>
    <ContextMenuProvider>
      <CustomProvider>
        <CommanderProvider>
          <RouterView />
        </CommanderProvider>
      </CustomProvider>
    </ContextMenuProvider>
  </ThemeProvider>
</template>
