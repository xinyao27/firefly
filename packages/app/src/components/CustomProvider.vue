<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'

window.$message = useMessage()
window.$router = useRouter()
</script>

<template>
  <slot />
  <div hidden>
    <i i-tabler-grip-vertical />
    <i i-ri-h-1 />
    <i i-ri-h-2 />
    <i i-ri-h-3 />
    <i i-ri-list-ordered />
    <i i-ri-list-unordered />
    <i i-ri-double-quotes-l />
    <i i-ri-code-box-line />
    <i i-ri-arrow-drop-down-line />
    <i i-ri-download-2-line />
    <i i-ri-upload-2-line />
    <i i-ri-upload-2-line />
    <i i-ri-restart-line />
    <i i-ri-pencil-line />
    <i i-ri-send-plane-line />
    <i i-ri-bold />
    <i i-ri-italic />
    <i i-ri-underline />
    <i i-ri-strikethrough />
    <i i-ri-code-line />
    <i i-ri-translate-2 />
    <i i-tabler-float-left />
    <i i-ri-magic-line />
    <i i-ri-check-line />
    <i i-ri-list-check-2 />
    <i i-ri-text />
    <div class="!w-300px text-neutral-800 bg-neutral-200" />
  </div>
</template>
