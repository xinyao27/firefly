<script setup lang="ts">
defineOptions({ name: 'DesktopPage' })

const { t } = useI18n()

const appleMacDownloadUrl = ref('')
const interMacDownloadUrl = ref('')
const windowsDownloadUrl = ref('')

onMounted(async () => {
  const response = await fetch('https://api.github.com/repos/chenyueban/firefly/releases')
  const data = (await response.json()) as any[]
  const latestRelease = data[0]
  const latestVersion = latestRelease?.tag_name?.split('v')?.[1]
  appleMacDownloadUrl.value = `https://github.com/chenyueban/firefly/releases/download/v${latestVersion}/Firefly_${latestVersion}_aarch64.dmg`
  interMacDownloadUrl.value = `https://github.com/chenyueban/firefly/releases/download/v${latestVersion}/Firefly_${latestVersion}_x64.dmg`
  windowsDownloadUrl.value = `https://github.com/chenyueban/firefly/releases/download/v${latestVersion}/Firefly_${latestVersion}_x64_en-US.msi`
})
function handleMacSelect(key: string) {
  if (key === 'apple')
    window.open(appleMacDownloadUrl.value, '_blank')
  else if (key === 'intel')
    window.open(interMacDownloadUrl.value, '_blank')
}
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
              Firefly for Mac & Windows
            </h2>
            <div flex justify-center gap-2>
              <NDropdown
                trigger="click"
                :options="
                  [
                    {
                      label: 'Apple Silicon',
                      key: 'apple',
                    }, {
                      label: 'Intel',
                      key: 'intel',
                    },
                  ]
                "
                @select="handleMacSelect"
              >
                <NButton
                  type="primary"
                  color="white"
                  :loading="!appleMacDownloadUrl || !interMacDownloadUrl"
                >
                  <template #icon>
                    <i i-ri-apple-fill />
                  </template>
                  {{ t('desktop.downloadForMac') }}
                </NButton>
              </NDropdown>
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
