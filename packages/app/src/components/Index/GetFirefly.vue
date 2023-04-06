<script setup lang="ts">
const { t } = useI18n()

const show = ref(false)
</script>

<template>
  <NButton
    type="primary"
    color="white"
    @click="show = true"
  >
    {{ t('index.getFirefly') }}
  </NButton>
  <NModal
    v-model:show="show"
    :mask-closable="false"
  >
    <NCard class="max-w-130 p-10 relative">
      <NButton
        class="absolute top-4 right-4"
        quaternary
        size="small"
        @click="show = false"
      >
        <template #icon>
          <i i-ri-close-line />
        </template>
      </NButton>
      <div flex flex-col gap-4>
        <img
          w-15 h-15 block mx-auto
          src="/icon.png"
          alt="logo"
        >
        <h2 class="text-center text-3xl">
          {{ t('index.getFirefly') }}
        </h2>
        <div flex flex-col text-neutral>
          <p text-center>
            {{ t('common.joinDesc1') }}
          </p>
          <p text-center>
            {{ t('common.joinDesc2') }}
          </p>
        </div>
        <div flex flex-col gap-2>
          <NInput :placeholder="t('common.joinPlaceholder')" />
          <NButton block>
            {{ t('common.joinus') }}
          </NButton>
        </div>
      </div>
    </NCard>
  </NModal>
</template>
