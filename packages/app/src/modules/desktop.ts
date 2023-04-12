import { is } from '@firefly/common'
import { type UserModule } from '~/types'

// eslint-disable-next-line import/no-mutable-exports
export let desktop: typeof import('@tauri-apps/api')

export const install: UserModule = async ({ isClient }) => {
  if (!isClient)
    return

  if (is.desktop())
    desktop = await import('@tauri-apps/api')
}
