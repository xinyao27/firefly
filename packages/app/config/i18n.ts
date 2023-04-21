import type { NuxtI18nOptions } from '@nuxtjs/i18n'
import { langMap } from '@firefly/common'
import type { LocaleObject } from '#i18n'

const availableLocales = Array.from(langMap.keys())
const locales = availableLocales.map<LocaleObject>(locale => ({
  code: locale,
  name: langMap.get(locale) ?? locale,
  file: `${locale}.yml`,
}))

export const i18n: NuxtI18nOptions = {
  locales,
  lazy: true,
  strategy: 'no_prefix',
  detectBrowserLanguage: false,
  langDir: '../../../locales',
  defaultLocale: 'en',
  vueI18n: {
    availableLocales,
    fallbackLocale: 'en',
    fallbackWarn: false,
    missingWarn: false,
  },
}
