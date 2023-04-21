import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

export default defineNuxtPlugin(async () => {
  await import('dayjs/locale/zh-cn')
  dayjs.locale('zh-cn')
  dayjs.extend(relativeTime)
})
