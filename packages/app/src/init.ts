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
  app.use(pinia)
  app.use(i18nInstance)
}
