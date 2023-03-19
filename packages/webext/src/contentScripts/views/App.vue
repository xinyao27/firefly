<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'
import Drag from './Drag.vue'
import SaveLink from './SaveLink.vue'
</script>

<template>
  <ThemeProvider>
    <Drag />
    <SaveLink />
  </ThemeProvider>
</template>
