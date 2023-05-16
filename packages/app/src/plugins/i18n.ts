import type { VueI18n } from 'vue-i18n'

// eslint-disable-next-line import/no-mutable-exports
export let $t: (key: string) => string

export default defineNuxtPlugin(async (nuxt) => {
  if (process.server)
    return

  const i18n = nuxt.vueApp.config.globalProperties.$i18n as VueI18n
  $t = nuxt.vueApp.config.globalProperties.$t
  const { setLocale } = i18n
  const settings = useSettings()
  const lang = $computed(() => settings.value.i18n)

  if (lang && lang !== i18n.locale)
    await setLocale(lang)

  watch([$$(lang)], () => {
    if (lang && lang !== i18n.locale)
      setLocale(lang)
  }, { immediate: true })
})
