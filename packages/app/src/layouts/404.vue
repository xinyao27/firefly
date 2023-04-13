<script setup lang="ts">
import { ThemeProvider } from '@firefly/theme'

const configStore = useConfigStore()
const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <ClientOnly>
    <ThemeProvider>
      <InjectProvider>
        <NLayout position="absolute">
          <NLayoutHeader
            bordered
            :style="`height: ${configStore.rootPaddingTop}px`"
          >
            <TitleBar />
          </NLayoutHeader>
          <NLayout
            has-sider
            position="absolute"
            :style="`top: ${configStore.rootPaddingTop}px`"
          >
            <NLayoutContent content-style="height: 100%">
              <main p="x4 y10" text="center teal-700 dark:gray-200">
                <div text-4xl>
                  <div i-ri-alarm-warning-fill inline-block />
                </div>
                <RouterView />
                <div>
                  <NButton btn text-sm m="3 t8" @click="router.replace('/')">
                    {{ t('common.back') }}
                  </NButton>
                </div>
              </main>
            </NLayoutContent>
          </NLayout>
        </NLayout>
      </InjectProvider>
    </ThemeProvider>
  </ClientOnly>
</template>
