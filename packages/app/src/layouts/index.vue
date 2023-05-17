<script setup lang="ts">
import '~/styles/main.sass'

const userStore = useUserStore()

onMounted(async () => {
  const profiles = await userStore.getUserProfiles()
  if (profiles && !profiles.token) {
    // 如果没有 token 自动生成一个
    await userStore.generateToken()
  }
})
</script>

<template>
  <main h-full>
    <slot />
  </main>
</template>
