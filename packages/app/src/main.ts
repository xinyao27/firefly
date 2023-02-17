import devtools from '@vue/devtools'
import { createApp } from 'vue'
import { setupLayouts } from 'virtual:generated-layouts'
import Preview from 'vite-plugin-vue-component-preview/client'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import type { RouteLocationNormalized } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import App from './App.vue'
import generatedRoutes from '~pages'

import 'uno.css'
import './styles/normalize.css'
import './styles/main.sass'

if (import.meta.env.DEV) {
  devtools.connect('localhost', 8098)
}

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

document.oncontextmenu = () => false

const history = createWebHashHistory()
const routes = setupLayouts(generatedRoutes)
const router = createRouter({ history, routes })
const routeHistory: RouteLocationNormalized[] = []
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
app.use(Preview)

const configStore = useConfigStore()
router.beforeEach((to, from) => {
  if (to.path !== from.path) { NProgress.start() }
  configStore.rightBarCollapsed = true
  configStore.leftBarCollapsed = true
})
function getRouteIndex(path: string) {
  for (const i in routeHistory) {
    const r = routeHistory[i]
    if (r.path === path) {
      return Number(i)
    }
  }
  return -1
}
router.afterEach((to) => {
  NProgress.done()
  const index = getRouteIndex(to.path)
  if (index !== -1) {
    routeHistory.splice(index, 1)
  }
  routeHistory.push(to)
})
// @ts-expect-error noop
router.routeHistory = routeHistory

app.mount('#app')
