<script setup lang="ts">
import { supabase } from '~/api'

async function signInWithGithub() {
  await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:5173',
    },
  })
}
</script>

<template>
  <main w-screen h-screen flex items-center justify-center>
    <section flex flex-col gap-2>
      <NButton @click="signInWithGithub">
        <template #icon>
          <i i-ri-github-fill />
        </template>
        Continue with Github
      </NButton>
    </section>
  </main>
</template>

<route lang="yaml">
meta:
  layout: none
</route>
