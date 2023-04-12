import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { type UserModule } from '~/types'

export const install: UserModule = async ({ isClient }) => {
  if (!isClient)
    return

  await import('dayjs/locale/zh-cn')
  dayjs.locale('zh-cn')
  dayjs.extend(relativeTime)
}
