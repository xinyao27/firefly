<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <button
    btn-slate
    @click="router.push('/login')"
  >
    {{ t('common.login') }}
  </button>
  <button
    btn-white
    @click="router.push('/signup')"
  >
    {{ t('common.signup') }}
  </button>
</template>
