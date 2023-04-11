<script setup lang="ts">
import type { FormInst, FormRules, StepsProps } from 'naive-ui'
import { useMessage } from 'naive-ui'
import type { CopilotModel } from '@firefly/common'
import { TonyStark } from './tonyStark'

const props = defineProps<{
  onCreated: () => void
}>()

const { t } = useI18n()
const message = useMessage()
const tagStore = useTagStore()
const copilotHubStore = useCopilotHubStore()
const current = ref(1)
const currentStatus = ref<StepsProps['status']>('process')
const selectedTags = ref<string[]>([])
const loading = ref(false)
const formRef = ref<FormInst | null>(null)
const model = ref<CopilotModel>({
  name: '',
  description: '',
  prompt: '',
  visibility: 'public',
})
const rules: FormRules = {
  name: [
    {
      required: true,
      message: t('common.required'),
    },
  ],
  description: [
    {
      required: true,
      message: t('common.required'),
    },
  ],
}

function handleBack() {
  if (current.value === 1)
    return
  current.value = current.value - 1
}
async function handleNext() {
  loading.value = true
  try {
    if (current.value === 2) {
      // config
      await formRef.value?.validate()

      await copilotHubStore.create(model.value, selectedTags.value)
      props.onCreated()
    }
    else if (current.value === 1) {
      // select tags
      if (selectedTags.value.length < 1)
        throw (t('copilot.selectedTagsRequired'))
    }
    currentStatus.value = 'process'
    current.value = current.value + 1
  }
  catch (err: any) {
    console.error(err)
    message.error(err.message || err)
    currentStatus.value = 'error'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <NCard
    style="width: 800px"
    :title="t('copilot.createACopilot')"
    :bordered="false"
    role="dialog"
    aria-modal="true"
  >
    <NSteps
      :current="current"
      :status="currentStatus"
      size="small"
    >
      <NStep
        :title="t('copilot.selectTags')"
      />
      <NStep
        :title="t('copilot.Config')"
      />
    </NSteps>
    <div mt-8>
      <!-- Choose Tags -->
      <div v-if="current === 1">
        <p text-xs text-neutral>
          {{ t('copilot.selectTagsPlaceholder') }}
        </p>
        <div flex flex-wrap gap-2 mt-4>
          <NTag
            v-for="tag in tagStore.tags"
            :key="tag.id"
            class="cursor-pointer hover:bg-(slate opacity-30)"
            :bordered="false"
            size="small"
            checkable
            :checked="selectedTags.includes(tag.name)"
            @update-checked="selectedTags = $event ? [...selectedTags, tag.name] : selectedTags.filter(name => name !== tag.name)"
          >
            <template #avatar>
              <Bubble
                :color="tag.color"
              />
            </template>
            {{ tag.name }}
          </NTag>
        </div>
      </div>
      <!-- Config -->
      <div v-if="current === 2">
        <NForm
          ref="formRef"
          :model="model"
          :rules="rules"
        >
          <NFormItem :label="t('copilot.name')" path="name">
            <NInput
              v-model:value="model.name"
              :placeholder="TonyStark.name"
            />
          </NFormItem>
          <NFormItem :label="t('copilot.description')" path="description">
            <NInput
              v-model:value="model.description"
              type="textarea"
              :placeholder="TonyStark.description"
            />
          </NFormItem>
          <NFormItem :label="t('copilot.prompt')" path="prompt">
            <NInput
              v-model:value="model.prompt"
              type="textarea"
              :placeholder="TonyStark.prompt"
            />
          </NFormItem>
          <NFormItem :label="t('copilot.visibility')" path="visibility">
            <NRadioGroup v-model:value="model.visibility">
              <NSpace>
                <NRadio value="public">
                  public
                </NRadio>
                <NRadio value="private" disabled>
                  private
                </NRadio>
              </NSpace>
            </NRadioGroup>
          </NFormItem>
        </NForm>
      </div>

      <div w-full flex justify-end gap-2 mt-6>
        <NButton
          type="error"
          tertiary
          size="small"
          :disabled="current === 1"
          @click="handleBack"
        >
          {{ t('common.back') }}
        </NButton>
        <NButton
          v-if="current !== 2"
          :loading="loading"
          tertiary
          size="small"
          @click="handleNext"
        >
          {{ t('common.next') }}
        </NButton>
        <NButton
          v-else
          :loading="loading"
          tertiary
          size="small"
          @click="handleNext"
        >
          {{ t('common.create') }}
        </NButton>
      </div>
    </div>
  </NCard>
</template>
