<script setup lang="ts">
import { Spin, is } from '@firefly/common'
import { useRouteHash } from '@vueuse/router'
import { supabase } from '~/modules/api'
import { bc } from '~/utils'

defineOptions({ name: 'RedirectPage' })

const { t } = useI18n()
const search = useRouteHash()
const router = useRouter()
const error = ref<{ type: string; description: string } | null>(null)

onMounted(async () => {
  const hash = search.value.slice(1)
  const searchParams = new URLSearchParams(hash)
  if (searchParams.get('type') === 'signup') {
    const searchParams = new URLSearchParams(hash)
    const access_token = searchParams.get('access_token')
    const refresh_token = searchParams.get('refresh_token')
    if (access_token && refresh_token) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })
      if (sessionError) {
        error.value = {
          type: t('common.loginError'),
          description: 'Set session error',
        }
      }
      else {
        router.replace('/inbox')
      }
    }
    else {
      error.value = {
        type: t('common.loginError'),
        description: 'No access_token or refresh_token',
      }
    }
  }
  else if (window.opener?.postMessage) {
    window.opener.postMessage({ type: 'firefly_auth', hash }, window.location.origin)
  }
  else if (is.desktop() && bc.name === 'firefly_auth') {
    bc.postMessage(hash)
  }
  else if (searchParams.get('error')) {
    error.value = {
      type: searchParams.get('error')!,
      description: searchParams.get('error_description')!,
    }
  }
})
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
    <Spin v-else />
  </div>
</template>

<route lang="yaml">
meta:
  layout: index
</route>
