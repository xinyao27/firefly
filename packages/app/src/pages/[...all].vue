<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div>
    {{ t('common.not-found') }}
  </div>
</template>

<route lang="yaml">
meta:
  layout: 404
</route>
