import { createPinia } from 'pinia'
import type { App } from 'vue'
import { getCurrentContext } from 'webext-bridge'
import { createI18n } from 'vue-i18n'

export function setupApp(app: App) {
  const context = getCurrentContext()

  // Inject a globally available `$app` object in template
  app.config.globalProperties.$app = { context }

  // Provide access to `app` in script setup with `const app = inject('app')`
  app.provide('app', app.config.globalProperties.$app)

  const blocks = Object.fromEntries(Object.entries(import.meta.glob<{ default: any }>('../../../../locales/*.y(a)?ml', { eager: true }))
    .map(([key, value]) => {
      const yaml = key.endsWith('.yaml')
      return [key.slice(14, yaml ? -5 : -4), value.default]
    }))

  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    blocks,
  })
  const pinia = createPinia()
  app.use(i18n)
  app.use(pinia)
}
