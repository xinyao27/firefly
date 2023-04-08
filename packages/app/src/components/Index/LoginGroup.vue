<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <NButton
    quaternary
    @click="router.push('/signup')"
  >
    {{ t('common.signup') }}
  </NButton>
  <NButton
    type="primary"
    color="white"
    @click="router.push('/login')"
  >
    {{ t('common.login') }}
  </NButton>
</template>
