<script setup lang="ts">
import { useMessage } from 'naive-ui'

window.$message = useMessage()
</script>

<template>
  <slot />
  <div hidden>
    <i i-ri-h-1 />
    <i i-ri-h-2 />
    <i i-ri-h-3 />
    <i i-ri-list-ordered />
    <i i-ri-list-unordered />
    <i i-ri-double-quotes-l />
    <i i-ri-code-box-line />
    <i i-ri-drag-move-line />
    <i i-ri-arrow-drop-down-line />
    <div class="!w-300px text-neutral-800" />
  </div>
</template>
