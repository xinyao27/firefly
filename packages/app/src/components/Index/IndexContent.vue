<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
</script>

<template>
  <div mt-16 flex flex-col>
    <div relative>
      <div mx-auto max-w-7xl px-4 pb-32 pt-20 lg:px-8 sm:px-6 lg:pb-40 lg:pt-28>
        <div relative>
          <h1 class="flex flex-col text-center text-6xl font-semibold tracking-tight capitalize text-white sm:(flex-row justify-center text-8xl)">
            <span class="select-none from-purple to-rose bg-(gradient-to-r clip-text) text-transparent">AI.</span>
            <span class="select-none">Capture.</span>
            <span class="select-none">Copilot Hub</span>
          </h1>
          <p mx-auto mt-12 max-w-3xl text-center text-lg leading-8 text-neutral-300>
            {{ t('common.slogan') }}
          </p>
        </div>
      </div>
    </div>

    <div class="relative hidden lg:block">
      <div mx-auto max-w-6xl px-4 pb-16 lg:px-8 sm:px-6>
        <div
          relative rounded-lg
          class="border-gradient"
        >
          <div class="overflow-hidden rounded-lg pb-168">
            <img
              absolute left-0 top-0 z-1 h-full w-full rounded-lg object-cover
              src="~/assets/images/hero.png"
              alt="Hero"
            >
          </div>
        </div>
      </div>
    </div>

    <div relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-32 sm:px-6>
      <h3 mt-8 text-center text-2xl font-bold tracking-tight lg:text-4xl sm:text-3xl>
        AI
      </h3>
      <p mx-auto mt-12 max-w-3xl text-center text-lg leading-8 text-neutral-300>
        {{ t('index.featureAI') }}
      </p>
      <div class="grid mt-16 gap-2 lg:grid-cols-2">
        <div class="relative overflow-hidden rounded-lg px-16">
          <img
            h-full w-full
            src="~/assets/images/hero_ai.png"
            alt="Hero AI"
          >
        </div>
        <div class="mt-8 flex flex-col justify-center gap-6 text-center text-lg leading-8 lg:(mt-0 text-left)">
          <div class="relative mx-auto mb-4 h-10 w-10 flex flex-shrink-0 items-center justify-center border border-(gray opacity-20) rounded-lg lg:mx-0">
            <i i-ri-sparkling-2-fill />
          </div>
          <h4 text-xl font-bold tracking-tight lg:text-3xl sm:text-2xl>
            {{ t('index.featureAISubTitle') }}
          </h4>
          <p text-neutral-400>
            {{ t('index.featureAIDesc') }}
          </p>
        </div>
      </div>
    </div>
    <div relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-32 sm:px-6>
      <h3 mt-8 text-center text-xl font-bold tracking-tight lg:text-3xl sm:text-2xl>
        Capture
      </h3>
      <p mx-auto mt-12 max-w-3xl text-center text-lg leading-8 text-neutral-300>
        {{ t('index.featureCapture') }}
      </p>
      <div class="grid mt-16 gap-2 lg:(order-last grid-cols-2)">
        <div class="relative overflow-hidden rounded-lg shadow-lg">
          <img
            h-full w-full
            src="~/assets/images/hero_assistant.png"
            alt="Hero Assistant"
          >
        </div>
        <div class="mt-8 flex flex-col justify-center gap-6 text-center text-lg leading-8 lg:(order-first mt-0 text-left)">
          <div class="relative mx-auto mb-4 h-10 w-10 flex flex-shrink-0 items-center justify-center border border-(gray opacity-20) rounded-lg lg:mx-0">
            <i i-ri-markdown-fill />
          </div>
          <h4 text-xl font-bold tracking-tight lg:text-3xl sm:text-2xl>
            {{ t('index.featureCaptureSubTitle') }}
          </h4>
          <p text-neutral-400>
            {{ t('index.featureCaptureDesc') }}
          </p>
        </div>
      </div>
    </div>
    <div relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-32 sm:px-6>
      <h3 mt-8 text-center text-xl font-bold tracking-tight lg:text-3xl sm:text-2xl>
        Copilot Hub
      </h3>
      <p mx-auto mt-12 max-w-3xl text-center text-lg leading-8 text-neutral-300>
        {{ t('index.featureCopilotHub') }}
      </p>
      <div class="grid mt-8 gap-2">
        <div class="flex flex-col items-center justify-center gap-6 text-center text-lg leading-8">
          <div class="relative mx-auto mb-4 h-10 w-10 flex flex-shrink-0 items-center justify-center border border-(gray opacity-20) rounded-lg lg:mx-0">
            <i i-ri-copilot-fill />
          </div>
          <h4 text-xl font-bold tracking-tight lg:text-3xl sm:text-2xl>
            {{ t('index.featureCopilotHubSubTitle') }}
          </h4>
          <p text-neutral-400>
            {{ t('index.featureCopilotHubDesc') }}
          </p>
          <div class="relative overflow-hidden rounded-lg shadow-lg">
            <img
              h-full w-full
              src="~/assets/images/hero_copilot.png"
              alt="Hero Copilot"
            >
          </div>
        </div>
      </div>
    </div>

    <div relative>
      <div mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-32 sm:px-6>
        <div relative text-center>
          <img
            mx-auto mb-5 h-20 w-20
            src="/icon.png" alt="firefly logo"
          >
          <h2 mb-5 text-3xl font-bold tracking-tight sm:text-4xl>
            {{ t('index.getFireflySlogan') }}
          </h2>
          <div flex justify-center gap-2>
            <template v-if="userStore.profiles">
              <button
                btn-white
                @click="router.push('/inbox')"
              >
                {{ t('common.openApp') }}
              </button>
            </template>
            <template v-else>
              <IndexLoginGroup />
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
