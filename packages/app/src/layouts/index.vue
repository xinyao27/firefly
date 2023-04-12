<script setup lang="ts">
import { getUser } from '@firefly/common'

const userStore = useUserStore()

onMounted(async () => {
  await getUser(true)
  const profiles = await userStore.getUserProfiles()
  if (profiles && !profiles.token) {
    // 如果没有 token 自动生成一个
    await userStore.generateToken()
  }
})
</script>

<template>
  <main h-full>
    <RouterView />
  </main>
</template>
