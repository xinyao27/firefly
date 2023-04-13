<script setup lang="ts">
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
