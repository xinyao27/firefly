<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'

defineOptions({ name: 'CopilotHubPage' })

const { t } = useI18n()
const copilotHubStore = useCopilotHubStore()
const createACopilotShow = ref(false)

onMounted(() => {
  copilotHubStore.findMy()
  copilotHubStore.findAll()
})
function handleCreated() {
  createACopilotShow.value = false
  copilotHubStore.findMy()
}
</script>

<template>
  <main h-full overflow-hidden>
    <div h-full p-4>
      <section>
        <h2 text-2xl font-bold mb-4>
          My Copilots
        </h2>

        <NButton
          class="mb-4"
          tertiary
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

        <div grid grid-cols-2 gap-4>
          <Copilot
            v-for="copilot in copilotHubStore.myCopilots"
            :key="copilot.id"
            :data="copilot"
          />
        </div>
      </section>

      <section mt-8>
        <h2 text-2xl font-bold mb-4>
          Explorer
        </h2>

        <RecycleScroller
          :items="copilotHubStore.copilots"
          :item-size="128"
          page-mode
        >
          <template #default="{ item }">
            <div pb-4>
              <Copilot :data="item" />
            </div>
          </template>
        </RecycleScroller>
      </section>
    </div>
  </main>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
