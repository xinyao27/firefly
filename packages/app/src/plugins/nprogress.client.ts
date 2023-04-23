import NProgress from 'nprogress'

export default defineNuxtPlugin((nuxt) => {
  nuxt.hooks.hook('page:start', () => {
    NProgress.start()
  })
  nuxt.hooks.hook('page:finish', () => {
    NProgress.done()
  })
})
