import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import * as Sentry from '@sentry/vue'
import { getUser, is } from '@firefly/common'
import App from './App.vue'
import { init } from './init'
import generatedRoutes from '~pages'

const history = createWebHistory()
const routes = setupLayouts(generatedRoutes)
const router = createRouter({ history, routes })
router.beforeEach(async (to, _, next) => {
  // Redirect to inbox if logged in
  if (is.desktop()) {
    if (to.path === '/') {
      if (await getUser())
        next({ path: 'inbox' })
      else
        next({ path: 'login' })
    }
    next()
  }
  else {
    next()
  }
})
const app = createApp(App)

app.use(router)
init(app)

if (import.meta.env.PROD) {
  Sentry.init({
    app,
    dsn: 'https://636feb99e0294038b69c8f2ba6750d1d@o4504924957769728.ingest.sentry.io/4504924960063488',
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracePropagationTargets: ['firefly.best', /^\//],
      }),
    ],
    environment: 'production',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
}
