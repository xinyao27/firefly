import { is } from '@firefly/common'
import { type UserModule } from '~/types'

// https://github.com/antfu/vite-plugin-pwa#automatic-reload-when-new-content-available
export const install: UserModule = ({ router }) => {
  router?.isReady()
    .then(async () => {
      if (!is.desktop()) {
        const { registerSW } = await import('virtual:pwa-register')
        registerSW({ immediate: true })
      }
    })
    .catch(() => {})
}

export const enable = ['index']
