<script setup lang="ts">
defineOptions({ name: 'CopilotHubPage' })

const { t } = useI18n()

const createACopilotShow = ref(false)
</script>

<template>
  <main h-full overflow-hidden>
    <div h-full p-4>
      <section>
        <h2 text-2xl font-bold mb-5>
          My Copilots
        </h2>
        <NButton
          tertiary
          @click="createACopilotShow = true"
        >
          <template #icon>
            <i i-ri-add-line />
          </template>
          {{ t('copilot.createACopilot') }}
        </NButton>
        <NModal v-model:show="createACopilotShow">
          <CreateACopilot />
        </NModal>
      </section>
      <section />
    </div>
  </main>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
