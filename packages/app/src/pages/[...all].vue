<script setup lang="ts">
definePageMeta({
  layout: '404',
})

const { t } = useI18n()
</script>

<template>
  <div>
    {{ t('common.notFound') }}
  </div>
</template>
