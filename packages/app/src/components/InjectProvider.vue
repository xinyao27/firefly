<script setup lang="ts">
window.$message = useMessage()
window.$router = useRouter()
window.$route = useRoute()
</script>

<template>
  <slot />
</template>
