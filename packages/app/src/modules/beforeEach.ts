import { getUser, is } from '@firefly/common'
import { type UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (!isClient)
    return

  router?.beforeEach(
    async (to, _, next) => {
      if (to.path === '/') {
        // Redirect to inbox if logged in
        if (await getUser()) {
          return next({ path: 'inbox' })
        }
        // not logged in
        else {
          // Redirect to login if on desktop
          if (is.desktop())
            return next({ path: 'login' })

          return next()
        }
      }
      else if (to.path === '/inbox') {
        // Redirect to login if not logged in
        if (!(await getUser()))
          return next({ path: 'login' })
      }
      next()
    },
  )
}

export const enable = ['index']
