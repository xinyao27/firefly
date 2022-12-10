import { createApp } from 'vue'
import { setupLayouts } from 'virtual:generated-layouts'
import Previewer from 'virtual:vue-component-preview'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import App from './App.vue'
import generatedRoutes from '~pages'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

document.oncontextmenu = () => false

const history = createWebHashHistory()
const routes = setupLayouts(generatedRoutes)
const router = createRouter({ history, routes })
router.beforeEach((to, from) => {
  if (to.path !== from.path) { NProgress.start() }
})
router.afterEach(() => {
  NProgress.done()
})
const pinia = createPinia()
const messages = Object.fromEntries(Object.entries(import.meta.glob<{ default: any }>('../../locales/*.y(a)?ml', { eager: true }))
  .map(([key, value]) => {
    const yaml = key.endsWith('.yaml')
    return [key.slice(14, yaml ? -5 : -4), value.default]
  }))
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
})

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(i18n)
app.use(Previewer)

app.mount('#app')
