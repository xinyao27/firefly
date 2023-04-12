import { type UserModule } from '~/types'

export const install: UserModule = async ({ isClient, app }) => {
  if (!isClient)
    return

  await import('naive-ui').then((naive) => {
    app.use(naive.default)
  })
}
