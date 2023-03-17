<script setup lang="ts">
import { useLoadingBar } from 'naive-ui'

const uploadStore = useUploadStore()
const loadingBar = useLoadingBar()
watchEffect(() => {
  if (uploadStore.isUploading)
    loadingBar.start()

  else
    loadingBar.finish()
})
</script>

<template>
  <div />
</template>
