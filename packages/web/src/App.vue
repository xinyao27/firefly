<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
</script>

<template>
  <ThemeProvider>
    <ContextMenuProvider>
      <CustomProvider>
        <CopilotProvider>
          <RouterView />
        </CopilotProvider>
      </CustomProvider>
    </ContextMenuProvider>
  </ThemeProvider>
</template>
