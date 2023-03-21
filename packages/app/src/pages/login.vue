<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { supabase } from '~/api'

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  email: '',
})
const rules = {
  email: {
    required: true,
    message: '请输入 Email',
    trigger: 'blur',
  },
}

const loading = ref(false)
async function signInWithGithub() {
  loading.value = true
  await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
  loading.value = false
}
async function signInWithNotion() {
  loading.value = true
  await supabase.auth.signInWithOAuth({
    provider: 'notion',
  })
  loading.value = false
}
const emailSended = ref(false)
function signInWithOtp() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true
      supabase.auth.signInWithOtp({
        email: formValue.value.email,
      })
        .then(() => {
          emailSended.value = true
        })
        .catch((error) => {
          message.error(error.message)
        })
        .finally(() => {
          loading.value = false
        })
    }
    else {
      message.error(errors[0]?.[0]?.message ?? '请输入 Email')
    }
  })
}
</script>

<template>
  <main w-screen h-screen flex items-center justify-center>
    <section w-80 bg-neutral-50 p-4 rounded-sm shadow-lg>
      <NH1 strong text-center>
        Log in
      </NH1>

      <section flex flex-col gap-2>
        <NButton
          :loading="loading"
          @click="signInWithGithub"
        >
          <template #icon>
            <i i-ri-github-fill />
          </template>
          Continue with Github
        </NButton>
        <NButton
          :loading="loading"
          @click="signInWithNotion"
        >
          <template #icon>
            <i i-tabler-brand-notion />
          </template>
          Continue with Notion
        </NButton>
      </section>

      <NDivider />

      <NForm
        ref="formRef"
        :model="formValue"
        :rules="rules"
        :show-label="false"
        :show-require-mark="false"
        :show-feedback="false"
      >
        <NFormItem
          class="mb-2"
          path="email"
        >
          <NInput
            v-model:value="formValue.email"
            placeholder="Enter your email address..."
            clearable
          />
        </NFormItem>

        <NFormItem
          v-if="emailSended"
          class="mb-2"
        >
          <div text-center>
            我们刚刚向您发送了一个登录邮件，请检查您的收件箱。
          </div>
        </NFormItem>

        <NButton
          block
          type="primary"
          secondary
          :loading="loading"
          @click="signInWithOtp"
        >
          Continue with email
        </NButton>
      </NForm>
    </section>
  </main>
</template>

<route lang="yaml">
meta:
  layout: none
</route>
