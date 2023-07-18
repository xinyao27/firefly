<script setup lang="ts">
import '~/styles/main.sass'

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <main p="x4 y10" text="center teal-700 dark:gray-200">
    <div text-4xl>
      <div i-ri-alarm-warning-fill inline-block />
    </div>
    <slot />
    <div>
      <NButton btn text-sm m="3 t8" @click="router.replace('/')">
        {{ t('common.back') }}
      </NButton>
    </div>
  </main>
</template>
