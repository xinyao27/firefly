import { createI18n } from 'vue-i18n'

const messages = Object.fromEntries(Object.entries(import.meta.glob<{ default: any }>('../../../locales/*.y(a)?ml', { eager: true }))
  .map(([key, value]) => {
    const yaml = key.endsWith('.yaml')
    return [key.slice(17, yaml ? -5 : -4), value.default]
  }))

const instance = createI18n({
  globalInjection: true,
  legacy: false,
  locale: 'en',
  messages,
})

export default instance
// @ts-expect-error noop
export const $t = instance.global.t
export const $i18n = instance.global
