import { createPinia } from 'pinia'
import type { App } from 'vue'
import { getCurrentContext } from 'webext-bridge'
import i18nInstance from './i18n'

export function setupApp(app: App) {
  const context = getCurrentContext()

  // Inject a globally available `$app` object in template
  app.config.globalProperties.$app = { context }

  // Provide access to `app` in script setup with `const app = inject('app')`
  app.provide('app', app.config.globalProperties.$app)

  const pinia = createPinia()
  app.use(i18nInstance)
  app.use(pinia)
}
