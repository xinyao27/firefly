import { setupLayouts } from 'virtual:generated-layouts'
import { colorDark, colorPrimary } from '@firefly/theme'
import { createHead } from '@vueuse/head'
import { createRouter, createWebHistory } from 'vue-router'
import { is } from '@firefly/common'
import App from './App.vue'
import type { UserModule, ViteModuleContext } from './types'
import generatedRoutes from '~pages'

import '@total-typescript/ts-reset'
import 'uno.css'
import '~/styles/normalize.css'
import '~/styles/main.sass'

const app = createApp(App)

const routes = setupLayouts(generatedRoutes)
const history = createWebHistory()
const router = createRouter({ history, routes })
app.use(router)

const head = createHead()
app.use(head)

const context: ViteModuleContext = {
  app,
  head,
  isClient: is.client(),
  router,
  routes,
}
Object.values(import.meta.glob<{ install: UserModule; enable: string[] }>('./modules/*.ts', { eager: true }))
  .forEach((i) => {
    if (i.enable.includes('index'))
      i.install?.(context)
  })

app.mount('#app')

// eslint-disable-next-line no-console
console.log(
  `%c Firefly %c v${import.meta.env.APP_VERSION} %c`,
  `background:${colorDark}; padding: 2px 1px; color: #FFF`,
  `background:${colorPrimary.default}; padding: 2px 1px; color: #FFF`,
  'background:transparent',
)
