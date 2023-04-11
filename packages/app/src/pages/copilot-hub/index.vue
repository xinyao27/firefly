<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'

defineOptions({ name: 'CopilotHubPage' })

const { t } = useI18n()
const userStore = useUserStore()
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
          />
        </div>
      </section>

      <section>
        <h2 text-2xl font-bold mb-4>
          Explorer
        </h2>

        <DynamicScroller
          :items="copilotHubStore.copilots"
          :min-item-size="80"
          page-mode
        >
          <template #default="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :size-dependencies="[
                item.content,
              ]"
              :data-index="index"
            >
              <div pb-4>
                <Copilot :data="item" />
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </section>
    </div>
  </main>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
