<script setup lang="ts">
import type { FormInst, FormRules, StepsProps } from 'naive-ui'
import type { BlockModel, CopilotModel } from '@firefly/common'
import { is } from '@firefly/common'
import { intersection } from 'lodash'
import TonyStark from './tonyStark'

const props = defineProps<{
  loading: boolean
  data?: CopilotModel
  onFinished: () => void
}>()
const emit = defineEmits(['update:loading'])
const loading = useVModel(props, 'loading', emit)

const { t } = useI18n()
const blockStore = useBlockStore()
const tagStore = useTagStore()
const copilotHubStore = useCopilotHubStore()
const current = ref(1)
const currentStatus = ref<StepsProps['status']>('process')
const selectedTags = ref<string[]>([])
const selectedBlocks = ref<string[]>([])
const tagBlocks = ref<BlockModel[]>([])
const tagBlocksLoading = ref(false)
const formRef = ref<FormInst | null>(null)
const model = ref<CopilotModel>({
  name: is.development() ? 'Tony Stark' : '',
  description: is.development() ? 'Private test AI' : '',
  prompt: is.development() ? 'Act as Tony Stark: You are Tony Stark, Anthony Edward "Tony" stark was a billionaire industrialist, a founding member of the Avengers, and the former c-e-o of stark Industries. a brash but brilliant inventor, stark was self-described as a genius, billionaire, playboy, and philanthropist.' : '',
  visibility: 'public',
})
const rules: FormRules = {
  name: [
    {
      required: true,
      message: t('common.required'),
    },
    {
      max: 20,
      message: 'Name can\'t be longer than 20 characters',
    },
  ],
  description: [
    {
      required: true,
      message: t('common.required'),
    },
    {
      max: 400,
      message: 'Description can\'t be longer than 400 characters',
    },
  ],
  prompt: [
    {
      max: 400,
      message: 'Prompt can\'t be longer than 400 characters',
    },
  ],
  visibility: [
    {
      required: true,
      message: t('common.required'),
    },
  ],
}

onMounted(async () => {
  if (props.data?.id) {
    model.value = props.data

    tagBlocksLoading.value = true
    const data = await copilotHubStore.getSelectedBlockIds(props.data.id)
    const blocks = blockStore.blocks.filter(block => data.some(v => v.id === block.id))
    tagBlocks.value = blocks
    selectedBlocks.value = blocks.map(block => block.id!)
    tagBlocksLoading.value = false
  }
})

watch(selectedTags, (value) => {
  const blocks = blockStore.blocks.filter(block => intersection(block.tags, value).length > 0)
  tagBlocks.value = blocks
  selectedBlocks.value = blocks.map(block => block.id!)
})

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

      if (props.data)
        await copilotHubStore.update(model.value, selectedBlocks.value)
      else
        await copilotHubStore.create(model.value, selectedBlocks.value)

      props.onFinished()
    }
    currentStatus.value = 'process'
    current.value = current.value + 1
  }
  catch (err: any) {
    currentStatus.value = 'error'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
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
        <div mt-4 flex flex-wrap gap-2>
          <NTag
            v-for="tag in tagStore.tags"
            :key="tag.id"
            class="cursor-pointer hover:bg-(slate opacity-30)"
            size="small"
            checkable
            :bordered="false"
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
        <div mt-4 max-h-80 flex flex-wrap gap-1 overflow-x-hidden overflow-y-auto>
          <template v-if="tagBlocksLoading">
            <NSkeleton :sharp="false" height="48px" width="33%" />
            <NSkeleton :sharp="false" height="48px" width="33%" />
            <NSkeleton :sharp="false" height="48px" width="100%" />
          </template>
          <template v-else>
            <NTag
              v-for="item in tagBlocks"
              :key="item.id"
              class="h-12 max-w-full"
              checkable
              :bordered="false"
              :checked="selectedBlocks.includes(item.id!)"
              @update-checked="selectedBlocks = $event ? [...selectedBlocks, item.id!] : selectedBlocks.filter(name => name !== item.id)"
            >
              <template #icon>
                <div h-12 max-w-16 flex flex-col items-center justify-center gap-1 overflow-hidden>
                  <i
                    v-if="item.category === 'link'"
                    i-ri-global-line text-sm
                  />
                  <i
                    v-else
                    i-ri-book-read-line text-sm
                  />
                  <NTag
                    v-for="tag in item.tags"
                    :key="tag"
                    size="tiny"
                    :bordered="false"
                  >
                    {{ tag }}
                  </NTag>
                </div>
              </template>
              <span class="line-clamp-3" v-html="item.content" />
            </NTag>
          </template>
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
              :maxlength="20"
            />
          </NFormItem>
          <NFormItem :label="t('copilot.description')" path="description">
            <NInput
              v-model:value="model.description"
              type="textarea"
              :placeholder="TonyStark.description"
              :maxlength="400"
            />
          </NFormItem>
          <NFormItem :label="t('copilot.prompt')" path="prompt">
            <NInput
              v-model:value="model.prompt"
              type="textarea"
              :placeholder="TonyStark.prompt"
              :maxlength="400"
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

      <div mt-6 w-full flex justify-end gap-2>
        <NButton
          type="error"
          tertiary
          size="small"
          :disabled="current === 1 || loading"
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
          {{ props.data ? t('common.update') : t('common.create') }}
        </NButton>
      </div>
    </div>
  </div>
</template>
