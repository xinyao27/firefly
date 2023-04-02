import type { App } from 'vue'
import { createPinia } from 'pinia'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { initDB } from '~/db'
import i18nInstance from '~/i18n'
import 'dayjs/locale/zh-cn'
import '@total-typescript/ts-reset'

import 'uno.css'
import '~/styles/normalize.css'
import '~/styles/main.sass'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const pinia = createPinia()

export function init(app: App<Element>) {
  initDB()
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const setting = localStorage.getItem('vueuse-color-scheme') || 'auto'
  if (setting === 'dark' || (prefersDark && setting !== 'light'))
    document.documentElement.classList.toggle('dark', true)

  document.oncontextmenu = () => false

  app.use(pinia)
  app.use(i18nInstance)

  app.mount('#app')
}
