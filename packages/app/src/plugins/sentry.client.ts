import { init as electronInit } from '@sentry/electron/renderer'
import { BrowserTracing, Replay, init as vueInit, vueRouterInstrumentation } from '@sentry/vue'
import { is } from '@firefly/common'

export default defineNuxtPlugin((nuxt) => {
  if (import.meta.env.PROD) {
    const { SENTRY_DSN } = useRuntimeConfig().public
    if (SENTRY_DSN) {
      const options = {
        app: nuxt.vueApp,
        dsn: SENTRY_DSN,
        integrations: [
          new BrowserTracing({
            routingInstrumentation: vueRouterInstrumentation(useRouter()),
            tracePropagationTargets: ['firefly.best', /^\//],
          }),
          new Replay({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        environment: 'production',
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 0.6,
        // This sets the sample rate to be 10%. You may want this to be 100% while
        // in development and sample at a lower rate in production
        replaysSessionSampleRate: 0.1,
        // If the entire session is not sampled, use the below sample rate to sample
        // sessions when an error occurs.
        replaysOnErrorSampleRate: 0.6,
      }
      if (is.desktop())
        electronInit(options, vueInit)
      else
        vueInit(options)
    }
  }
})
