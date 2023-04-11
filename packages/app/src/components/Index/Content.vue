<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
</script>

<template>
  <div flex flex-col mt-16>
    <div relative>
      <div mx-auto sm:px-6 lg:px-8 px-4 max-w-7xl pt-20 pb-32 lg:pt-28 lg:pb-40>
        <div relative>
          <h1 class="flex flex-col text-6xl text-center text-white font-semibold tracking-tight capitalize sm:(flex-row justify-center text-8xl)">
            <span class="select-none text-transparent bg-(clip-text gradient-to-r) from-purple to-rose">AI.</span>
            <span class="select-none ">Capture.</span>
            <span class="select-none ">Copilot Hub</span>
          </h1>
          <p max-w-3xl mx-auto mt-12 text-lg leading-8 text-neutral-300 text-center>
            {{ t('common.slogan') }}
          </p>
        </div>
      </div>
    </div>

    <div class="relative hidden lg:block">
      <div mx-auto sm:px-6 lg:px-8 px-4 max-w-6xl pb-16>
        <div
          relative rounded-lg
          class="border-gradient"
        >
          <div class="pb-168 overflow-hidden rounded-lg">
            <img
              w-full h-full z-1 absolute top-0 left-0 object-cover rounded-lg
              src="/images/hero.png"
              alt="Hero"
            >
          </div>
        </div>
      </div>
    </div>

    <div mx-auto sm:px-6 lg:px-8 px-4 max-w-7xl py-16 lg:py-32 relative>
      <h3 mt-8 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-center>
        AI
      </h3>
      <p max-w-3xl mx-auto mt-12 text-lg leading-8 text-neutral-300 text-center>
        {{ t('index.featureAI') }}
      </p>
      <div class="mt-16 grid gap-2 lg:grid-cols-2">
        <div class="relative rounded-lg px-16 overflow-hidden">
          <img
            w-full h-full
            src="/images/hero_ai.png"
            alt="Hero AI"
          >
        </div>
        <div class="flex flex-col justify-center gap-6 text-lg leading-8 text-center mt-8 lg:(text-left mt-0)">
          <div class="relative rounded-lg flex items-center justify-center mb-4 w-10 h-10 border border-(gray opacity-20) flex-shrink-0 mx-auto lg:mx-0">
            <i i-ri-openai-line />
          </div>
          <h4 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight>
            {{ t('index.featureAISubTitle') }}
          </h4>
          <p text-neutral-400>
            {{ t('index.featureAIDesc') }}
          </p>
        </div>
      </div>
    </div>
    <div mx-auto sm:px-6 lg:px-8 px-4 max-w-7xl py-16 lg:py-32 relative>
      <h3 mt-8 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-center>
        Capture
      </h3>
      <p max-w-3xl mx-auto mt-12 text-lg leading-8 text-neutral-300 text-center>
        {{ t('index.featureCapture') }}
      </p>
      <div class="mt-16 grid gap-2 lg:(grid-cols-2 order-last)">
        <div class="relative rounded-lg shadow-lg overflow-hidden">
          <img
            w-full h-full
            src="/images/hero_assistant.png"
            alt="Hero Assistant"
          >
        </div>
        <div class="flex flex-col justify-center gap-6 text-lg leading-8 text-center mt-8 lg:(text-left mt-0 order-first)">
          <div class="relative rounded-lg flex items-center justify-center mb-4 w-10 h-10 border border-(gray opacity-20) flex-shrink-0 mx-auto lg:mx-0">
            <i i-ri-markdown-fill />
          </div>
          <h4 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight>
            {{ t('index.featureCaptureSubTitle') }}
          </h4>
          <p text-neutral-400>
            {{ t('index.featureCaptureDesc') }}
          </p>
        </div>
      </div>
    </div>
    <div mx-auto sm:px-6 lg:px-8 px-4 max-w-7xl py-16 lg:py-32 relative>
      <h3 mt-8 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-center>
        Copilot Hub
      </h3>
      <p max-w-3xl mx-auto mt-12 text-lg leading-8 text-neutral-300 text-center>
        {{ t('index.featureCopilotHub') }}
      </p>
      <div class="mt-8 grid gap-2">
        <div class="flex flex-col justify-center items-center gap-6 text-lg leading-8 text-center">
          <div class="relative rounded-lg flex items-center justify-center mb-4 w-10 h-10 border border-(gray opacity-20) flex-shrink-0 mx-auto lg:mx-0">
            <i i-ri-copilot-fill />
          </div>
          <h4 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight>
            {{ t('index.featureCopilotHubSubTitle') }}
          </h4>
          <p text-neutral-400>
            {{ t('index.featureCopilotHubDesc') }}
          </p>
          <div class="relative rounded-lg shadow-lg overflow-hidden">
            <img
              w-full h-full
              src="/images/hero_copilot.png"
              alt="Hero Copilot"
            >
          </div>
        </div>
      </div>
    </div>

    <div relative>
      <div mx-auto sm:px-6 lg:px-8 px-4 max-w-7xl py-16 lg:py-32>
        <div relative text-center>
          <img
            w-20 h-20 mx-auto mb-5
            src="/icon.png" alt="firefly logo"
          >
          <h2 text-3xl font-bold tracking-tight sm:text-4xl mb-5>
            {{ t('index.getFireflySlogan') }}
          </h2>
          <div flex justify-center gap-2>
            <template v-if="userStore.profiles">
              <NButton
                type="primary"
                color="white"
                @click="router.push('/inbox')"
              >
                {{ t('common.openApp') }}
              </NButton>
            </template>
            <template v-else>
              <LoginGroup />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.border-gradient
  ::after
    content: ""
    --angle: 0deg
    border-radius: .5rem
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    margin: -1px
    opacity: .5
    animation: rotate 10s linear infinite
    background: linear-gradient(var(--angle),#52525b,#52525b,#407cff,#c084fc,#fb7185)

@keyframes rotate
  to
    --angle: 360deg

@property --angle
  syntax: "<angle>"
  initial-value: 0deg
  inherits: false
</style>
