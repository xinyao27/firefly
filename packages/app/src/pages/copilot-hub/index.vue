<script setup lang="ts">
defineOptions({ name: 'CopilotHubPage' })

const { t } = useI18n()
const userStore = useUserStore()
const copilotHubStore = useCopilotHubStore()
const createACopilotShow = ref(false)

onMounted(() => {
  nextTick(() => {
    if (!copilotHubStore.myCopilots.length)
      copilotHubStore.findMy()
    if (!copilotHubStore.copilots.length)
      copilotHubStore.findAll(copilotHubStore.page)
  })
})
function handleLoadMore() {
  copilotHubStore.page += 1
  nextTick(() => {
    copilotHubStore.findAll(copilotHubStore.page)
  })
}
function handleCreated() {
  createACopilotShow.value = false
  copilotHubStore.findMy()
}
</script>

<template>
  <main h-full overflow-x-hidden overflow-y-auto>
    <div h-full p-4>
      <section
        v-if="userStore.profiles"
        mb-8
      >
        <h2 text-2xl font-bold mb-4>
          My Copilots
          <span>({{ copilotHubStore.myCopilots.length }} / 3)</span>
        </h2>

        <NButton
          class="mb-4"
          tertiary
          :disabled="copilotHubStore.myCopilots.length >= 3"
          @click="createACopilotShow = true"
        >
          <template #icon>
            <i i-ri-add-line />
          </template>
          {{ t('copilot.createACopilot') }}
        </NButton>

        <NModal v-model:show="createACopilotShow">
          <CreateACopilot :on-created="handleCreated" />
        </NModal>

        <div grid grid-cols-1 lg:grid-cols-2 gap-4>
          <Copilot
            v-for="copilot in copilotHubStore.myCopilots"
            :key="copilot.id"
            :data="copilot"
            enable-edit
          />
        </div>
      </section>

      <section>
        <h2 text-2xl font-bold mb-4>
          Explorer
        </h2>

        <div grid grid-cols-1 lg:grid-cols-2 gap-4>
          <Copilot
            v-for="copilot in copilotHubStore.copilots"
            :key="copilot.id"
            :data="copilot"
          />
        </div>
        <NButton
          class="mt-8"
          block
          quaternary
          :disabled="!copilotHubStore.hasMore"
          @click="handleLoadMore"
        >
          <template v-if="copilotHubStore.hasMore" #icon>
            <i i-ri-arrow-down-s-line />
          </template>
          <span v-if="copilotHubStore.hasMore">{{ t('common.loadMore') }}</span>
          <span v-else>{{ t('common.noMore') }}</span>
        </NButton>
      </section>
    </div>
  </main>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
