<script setup lang="ts">
import { Spin } from '@firefly/common'
import { useRouteHash, useRouteQuery } from '@vueuse/router'
import { supabase } from '~/modules/api'

defineOptions({ name: 'RedirectPage' })

const { t } = useI18n()
const from = useRouteQuery<'web' | 'desktop'>('_f')
const type = useRouteQuery<'email' | 'oauth'>('_t')
const search = useRouteHash()
const router = useRouter()
const error = ref<{ type: string; description: string } | null>(null)
const success = ref(false)

onMounted(async () => {
  const hash = search.value.slice(1)
  const searchParams = new URLSearchParams(hash)

  // web email signup confirm
  if (type.value === 'email' && searchParams.get('type') === 'signup') {
    const searchParams = new URLSearchParams(hash)
    const access_token = searchParams.get('access_token')
    const refresh_token = searchParams.get('refresh_token')
    if (access_token && refresh_token) {
      if (from.value === 'web') {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })
        if (sessionError) {
          success.value = false
          error.value = {
            type: t('common.loginError'),
            description: 'Set session error',
          }
        }
        else {
          success.value = true
          router.replace('/inbox')
        }
      }
      else if (from.value === 'desktop') {
        const link = `firefly://redirect?${hash}`
        window.open(link, '_self')
        success.value = true
      }
    }
    else {
      success.value = false
      error.value = {
        type: t('common.loginError'),
        description: 'No access_token or refresh_token',
      }
    }
  }

  if (type.value === 'oauth') {
    // web oauth2
    if (from.value === 'web') {
      if (window.opener?.postMessage) {
        window.opener.postMessage({ type: 'firefly_auth', hash }, window.location.origin)
        success.value = true
      }
    }
    // desktop oauth2
    else if (from.value === 'desktop') {
      const link = `firefly://redirect?${hash}`
      window.open(link, '_self')
      success.value = true
    }
  }

  if (searchParams.get('error')) {
    success.value = false
    error.value = {
      type: searchParams.get('error')!,
      description: searchParams.get('error_description')!,
    }
  }
})
function handleClose() {
  if (success.value)
    window.close()
}
</script>

<template>
  <div w-screen h-screen flex justify-center items-center>
    <section
      v-if="error"
      class="p-3 bg-(red opacity-5) rounded"
    >
      <h2>{{ error.type }}</h2>
      <p>{{ error.description }}</p>
    </section>
    <section
      v-else-if="success"
      flex flex-col gap-4
    >
      <h2 text-xl font-bold>
        {{ t('common.success') }}
      </h2>
      <p>{{ t('common.redirecting') }}</p>
      <button btn-slate @click="handleClose">
        {{ t('common.close') }}
      </button>
    </section>
    <Spin v-else />
  </div>
</template>

<route lang="yaml">
meta:
  layout: index
</route>
