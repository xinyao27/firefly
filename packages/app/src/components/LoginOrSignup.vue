<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { is } from '@firefly/common'
import type { Event } from '@tauri-apps/api/event'
import { useRouteQuery } from '@vueuse/router'
import { tauri } from '~/plugins/tauri'
import { supabase } from '~/plugins/api'
import { parseSchema } from '~/utils'

const props = defineProps<{
  type: 'login' | 'signup'
}>()

const { t } = useI18n()
const router = useRouter()
const query = useRouteQuery('from')
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  email: '',
  loginCode: '',
})
const options = computed(() => {
  return ['@gmail.com', '@163.com', '@qq.com'].map((suffix) => {
    const prefix = formValue.value.email.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix,
    }
  })
})
const rules = {
  email: {
    required: true,
    message: t('login.emailRequired'),
    trigger: 'blur',
  },
}

const loading = ref(false)
async function signInWithToken(url: string) {
  if (is.desktop()) {
    tauri.event.listen('firefly_scheme', async (event: Event<string>) => {
      if (event.event === 'firefly_scheme') {
        const parsed = parseSchema(event.payload)
        const { access_token, refresh_token } = parsed || {}
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })
          if (error)
            message.error(error.message)
          else
            router.replace(query.value ? `/${query.value}` : '/inbox')
        }
        else {
          message.error(t('common.loginError'))
        }
      }
    })

    if (is.macOS()) {
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.className = 'hidden'
      document.body.append(a)
      a.click()
      document.body.removeChild(a)
    }
    else {
      window.open(url, '_blank', 'width=800,height=600')
    }
  }
  else {
    const authWindow = window.open(url, '_blank', 'width=800,height=600')
    window.addEventListener('message', async (event) => {
      if (event.origin.startsWith(window.location.origin) && event.data.type === 'firefly_auth') {
        // 接收到来自回调页面的消息
        const hash = event.data.hash
        const searchParams = new URLSearchParams(hash)
        const access_token = searchParams.get('access_token')
        const refresh_token = searchParams.get('refresh_token')
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })
          if (error) {
            message.error(error.message)
          }
          else {
            router.replace(query.value ? `/${query.value}` : '/inbox')
            authWindow?.close()
          }
        }
        else {
          message.error(t('common.loginError'))
          authWindow?.close()
        }
      }
    })
  }
}
async function signInWithGoogle() {
  try {
    loading.value = true
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        skipBrowserRedirect: true,
        redirectTo: `${window.location.origin}/redirect?_f=${is.desktop() ? 'desktop' : 'web'}&_t=oauth`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error)
      throw error
    if (data.url)
      await signInWithToken(data.url)
  }
  catch (error: any) {
    message.error(error.message || error.msg || error)
  }
  finally {
    loading.value = false
  }
}
async function signInWithGithub() {
  try {
    loading.value = true
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        skipBrowserRedirect: true,
        redirectTo: `${window.location.origin}/redirect?_f=${is.desktop() ? 'desktop' : 'web'}&_t=oauth`,
      },
    })
    if (error)
      throw error
    if (data.url)
      await signInWithToken(data.url)
  }
  catch (error: any) {
    message.error(error.message || error.msg || error)
  }
  finally {
    loading.value = false
  }
}
async function signInWithNotion() {
  try {
    loading.value = true
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'notion',
      options: {
        skipBrowserRedirect: true,
        redirectTo: `${window.location.origin}/redirect?_f=${is.desktop() ? 'desktop' : 'web'}&_t=oauth`,
      },
    })
    if (error)
      throw error
    if (data.url)
      await signInWithToken(data.url)
  }
  catch (error: any) {
    message.error(error.message || error.msg || error)
  }
  finally {
    loading.value = false
  }
}
const emailSended = ref(false)
function signInWithOtp() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true
      supabase.auth.signInWithOtp({
        email: formValue.value.email,
        options: {
          emailRedirectTo: `${window.location.origin}/redirect?_f=${is.desktop() ? 'desktop' : 'web'}&_t=email`,
          shouldCreateUser: props.type === 'signup',
        },
      })
        .then(({ error }) => {
          emailSended.value = true
          if (error)
            throw error
        })
        .catch((error) => {
          message.error(error.message || error.msg || error)
        })
        .finally(() => {
          loading.value = false
        })
    }
    else {
      message.error(errors[0]?.[0]?.message ?? t('login.emailRequired'))
    }
  })
}
function signInWithLoginCode() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true
      supabase.auth.verifyOtp({
        email: formValue.value.email,
        token: formValue.value.loginCode,
        type: 'magiclink',
      })
        .then(({ data, error }) => {
          if (data.session)
            router.replace(query.value ? `/${query.value}` : '/inbox')
          else
            throw error
        })
        .catch((error) => {
          message.error(error.message || error.msg || error)
        })
        .finally(() => {
          loading.value = false
        })
    }
    else {
      message.error(errors[0]?.[0]?.message ?? t('login.emailRequired'))
    }
  })
}
</script>

<template>
  <section mt--10vh w-80>
    <div flex items-center justify-center>
      <img
        block h-16 w-16
        src="/icon.png"
        alt="logo"
      >
    </div>
    <NH1 strong text-center>
      {{ props.type === 'login' ? t('common.login') : t('common.signup') }}
    </NH1>

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
        <NAutoComplete
          v-model:value="formValue.email"
          :placeholder="t('login.emailPlaceholder')"
          clearable
          :disabled="emailSended"
          :options="options"
        />
      </NFormItem>
      <NButton
        v-if="!emailSended"
        block
        class="mb-2"
        type="primary"
        :loading="loading"
        @click="signInWithOtp"
      >
        {{ t('login.continueWithEmail') }}
      </NButton>

      <NFormItem
        v-if="emailSended"
        class="mb-2"
      >
        <div text-center>
          {{ t('login.emailSended') }}
          <NButton
            size="tiny"
            :loading="loading"
            @click="signInWithOtp"
          >
            {{ t('login.resendEmail') }}
          </NButton>
        </div>
      </NFormItem>
      <template v-if="props.type === 'login'">
        <NFormItem
          v-if="emailSended"
          class="mb-2"
          path="loginCode"
        >
          <NInput
            v-model:value="formValue.loginCode"
            :placeholder="t('login.loginCodePlaceholder')"
            clearable
            maxlength="6"
          />
        </NFormItem>
        <NButton
          v-if="emailSended"
          block
          type="primary"
          :loading="loading"
          @click="signInWithLoginCode"
        >
          {{ t('login.continueWithLoginCode') }}
        </NButton>
      </template>
    </NForm>

    <div mt-6>
      <NButton
        v-if="props.type === 'login'"
        class="text-neutral"
        text
        block
        tag="a"
        @click="router.push('/signup')"
      >
        {{ t('login.redirectToSignup') }}
      </NButton>
      <NButton
        v-if="props.type === 'signup'"
        class="text-neutral"
        text
        block
        tag="a"
        @click="router.push('/login')"
      >
        {{ t('login.redirectToLogin') }}
      </NButton>
    </div>

    <NDivider>{{ t('login.otherLoginMethods') }}</NDivider>

    <NGrid x-gap="12" :cols="3">
      <NGi>
        <NTooltip>
          <template #trigger>
            <NButton

              tertiary block
              :loading="loading"
              @click="signInWithGoogle"
            >
              <template #icon>
                <i i-ri-google-fill />
              </template>
            </NButton>
          </template>
          <span>{{ t('login.continueWithGoogle') }}</span>
        </NTooltip>
      </NGi>
      <NGi>
        <NTooltip>
          <template #trigger>
            <NButton

              tertiary block
              :loading="loading"
              @click="signInWithGithub"
            >
              <template #icon>
                <i i-ri-github-fill />
              </template>
            </NButton>
          </template>
          <span>{{ t('login.continueWithGithub') }}</span>
        </NTooltip>
      </NGi>
      <NGi>
        <NTooltip>
          <template #trigger>
            <NButton

              tertiary block
              :loading="loading"
              @click="signInWithNotion"
            >
              <template #icon>
                <i i-ri-notion-fill />
              </template>
            </NButton>
          </template>
          <span>{{ t('login.continueWithNotion') }}</span>
        </NTooltip>
      </NGi>
    </NGrid>
  </section>
</template>
