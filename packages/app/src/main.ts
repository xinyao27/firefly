import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import App from './App.vue'
import { init } from './init'
import generatedRoutes from '~pages'

const history = createWebHistory()
const routes = setupLayouts(generatedRoutes)
const router = createRouter({ history, routes })
const app = createApp(App)

app.use(router)
init(app)

Sentry.init({
  app,
  dsn: 'https://636feb99e0294038b69c8f2ba6750d1d@o4504924957769728.ingest.sentry.io/4504924960063488',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: ['localhost', 'firefly.best', /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})
