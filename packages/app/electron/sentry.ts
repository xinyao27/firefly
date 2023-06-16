import { init } from '@sentry/electron/main'
import { is } from '@firefly/common'

if (process.env.SENTRY_DSN && is.production())
  init({ dsn: process.env.SENTRY_DSN })
