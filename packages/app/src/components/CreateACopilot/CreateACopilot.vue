<script setup lang="ts">
import type { FormInst, FormRules, StepsProps } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { TonyStark } from './tonyStark'

const { t } = useI18n()
const message = useMessage()

const tagStore = useTagStore()

const current = ref(1)
const currentStatus = ref<StepsProps['status']>('process')
const selectedTags = ref<string[]>([])
const formRef = ref<FormInst | null>(null)
const model = ref({
  name: TonyStark.name,
  description: TonyStark.description,
  prompt: TonyStark.prompt,
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

const buttonType = computed(() => {
  switch (currentStatus.value) {
    case 'error':
      return 'error'
    case 'finish':
      return 'success'
    default:
      return 'default'
  }
})

function handleBack() {
  if (current.value === 1)
    return
  current.value = current.value - 1
}
async function handleNext() {
  if (current.value === 3) {
    // create

    return
  }
  else if (current.value === 2) {
    // config
    try {
      await formRef.value?.validate()
    }
    catch (err) {
      console.error(err)
      currentStatus.value = 'error'
    }
    return
  }
  else if (current.value === 1) {
    // select tags
    if (selectedTags.value.length < 1) {
      message.error(t('copilot.selectedTagsRequired'))
      currentStatus.value = 'error'
      return
    }
  }
  currentStatus.value = 'process'
  current.value = current.value + 1
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
      v-model:current="current"
      :status="currentStatus"
      size="small"
    >
      <NStep
        :title="t('copilot.selectTags')"
      />
      <NStep
        :title="t('copilot.Config')"
      />
      <NStep
        :title="t('copilot.uploadData')"
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
            :checked="selectedTags.includes(tag.id)"
            @update-checked="selectedTags = $event ? [...selectedTags, tag.id] : selectedTags.filter(id => id !== tag.id)"
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
          v-if="current !== 3"
          :type="buttonType"
          tertiary
          size="small"
          @click="handleNext"
        >
          {{ t('common.next') }}
        </NButton>
        <NButton
          v-else
          :type="buttonType"
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
