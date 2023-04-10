<script setup lang="ts">
defineOptions({ name: 'DesktopPage' })

const { t } = useI18n()

const macDownloadUrl = ref('')
const windowsDownloadUrl = ref('')

onMounted(async () => {
  const response = await fetch('https://api.github.com/repos/chenyueban/firefly/releases')
  const data = (await response.json()) as any[]
  const latestRelease = data[0]
  const latestVersion = latestRelease?.tag_name?.split('v')?.[1]
  macDownloadUrl.value = `https://github.com/chenyueban/firefly/releases/download/v${latestVersion}/Firefly_${latestVersion}_x64.dmg`
  windowsDownloadUrl.value = `https://github.com/chenyueban/firefly/releases/download/v${latestVersion}/Firefly_${latestVersion}_x64_en-US.msi`
})
</script>

<template>
  <div class="root" h-full relative>
    <FireflyBg />
    <Header />
    <div h-full flex flex-col mt-16>
      <div relative flex-1>
        <div mx-auto sm:px-6 lg:px-8 px-4 max-w-7xl py-16 lg:py-32>
          <div relative text-center>
            <img
              w-20 h-20 mx-auto mb-5
              src="/icon.png" alt="firefly logo"
            >
            <h2 text-3xl font-bold tracking-tight sm:text-4xl mb-5>
              {{ t('desktop.title') }}
            </h2>
            <div flex justify-center gap-2>
              <NButton
                type="primary"
                color="white"
                tag="a"
                target="_blank"
                :href="macDownloadUrl"
                :loading="!macDownloadUrl"
              >
                <template #icon>
                  <i i-ri-apple-fill />
                </template>
                {{ t('desktop.downloadForMac') }}
              </NButton>
              <NButton
                type="primary"
                color="white"
                tag="a"
                target="_blank"
                :href="windowsDownloadUrl"
                :loading="!windowsDownloadUrl"
              >
                <template #icon>
                  <i i-ri-windows-fill />
                </template>
                {{ t('desktop.downloadForWindows') }}
              </NButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<route lang="yaml">
meta:
  layout: index
</route>
