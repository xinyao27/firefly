<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { t } = useI18n()
const userStore = useUserStore()
const copilotHubStore = useCopilotHubStore()
const createCopilotShow = ref(false)

onMounted(() => {
  if (!copilotHubStore.myCopilots.length)
    copilotHubStore.findMy()
  if (!copilotHubStore.copilots.length)
    copilotHubStore.findAll(copilotHubStore.page)
})
function handleLoadMore() {
  copilotHubStore.page += 1
  nextTick(() => {
    copilotHubStore.findAll(copilotHubStore.page)
  })
}
function handleCreated() {
  createCopilotShow.value = false
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
        <h2 mb-4 text-2xl font-bold>
          My Copilots
          <span>({{ copilotHubStore.myCopilots.length }} / 3)</span>
        </h2>

        <NButton
          class="mb-4"
          tertiary
          :disabled="copilotHubStore.myCopilots.length >= 3"
          @click="createCopilotShow = true"
        >
          <template #icon>
            <i i-ri-add-line />
          </template>
          {{ t('copilot.createCopilot') }}
        </NButton>

        <CreateOrUpdateCopilot
          v-model:show="createCopilotShow"
          :on-finished="handleCreated"
        />

        <div grid grid-cols-1 gap-4 lg:grid-cols-2>
          <Copilot
            v-for="copilot in copilotHubStore.myCopilots"
            :key="copilot.id"
            :data="copilot"
            enable-edit
          />
        </div>
      </section>

      <section>
        <h2 mb-4 text-2xl font-bold>
          Explorer
        </h2>

        <div grid grid-cols-1 gap-4 lg:grid-cols-2>
          <Copilot
            v-for="copilot in copilotHubStore.copilots"
            :key="copilot.id"
            :data="copilot"
          />
        </div>
        <NButton
          class="mt-8"
          quaternary
          block
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
