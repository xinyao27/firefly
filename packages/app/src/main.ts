import { createApp } from 'vue'
import { setupLayouts } from 'virtual:generated-layouts'
import { createPinia } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import App from './App.vue'
import generatedRoutes from '~pages'
import '@total-typescript/ts-reset'
import { initDB } from '~/db'
import i18nInstance from '~/i18n'

import 'uno.css'
import './styles/normalize.css'
import './styles/main.sass'

initDB()
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const setting = localStorage.getItem('vueuse-color-scheme') || 'auto'
if (setting === 'dark' || (prefersDark && setting !== 'light'))
  document.documentElement.classList.toggle('dark', true)

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

document.oncontextmenu = () => false

const history = createWebHistory()
const routes = setupLayouts(generatedRoutes)
const router = createRouter({ history, routes })
const routeHistory: RouteLocationNormalized[] = []
const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18nInstance)

router.beforeEach((to, from) => {
  if (to.path !== from.path)
    NProgress.start()
})
function getRouteIndex(path: string) {
  for (const i in routeHistory) {
    const r = routeHistory[i]
    if (r.path === path)
      return Number(i)
  }
  return -1
}
router.afterEach((to) => {
  NProgress.done()
  const index = getRouteIndex(to.path)
  if (index !== -1)
    routeHistory.splice(index, 1)

  routeHistory.push(to)
})
// @ts-expect-error noop
router.routeHistory = routeHistory

app.mount('#app')
