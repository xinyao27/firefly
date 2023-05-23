<script setup lang="ts">
import { appName } from '~~/constants'

definePageMeta({
  layout: 'none',
})

useHead({
  title: `Signup | ${appName}`,
})
</script>

<template>
  <main h-full w-full flex items-center justify-center>
    <FireflyBg />
    <LoginOrSignup type="signup" />
  </main>
</template>
