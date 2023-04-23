export default defineNuxtPlugin(async () => {
  if (import.meta.env.PROD)
    (await import('@vercel/analytics')).inject()
})
