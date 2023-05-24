import { getSession, is } from '@firefly/common'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server)
    return

  const session = await getSession()
  if (to.path === '/') {
    // Redirect to inbox if logged in
    if (session) {
      return navigateTo('/inbox')
    }
    // not logged in
    else {
      // Redirect to login if on desktop
      if (is.desktop())
        return navigateTo('/login', { replace: true })
    }
  }
  else if (to.path === '/inbox') {
    // Redirect to login if not logged in
    if (!session)
      return navigateTo('/login')
  }
  else if (to.path === '/thankyou') {
    // Redirect to login if not logged in
    if (!await getSession())
      return navigateTo('/login?from=thankyou')
  }
  else if (to.path === '/login' || to.path === '/signup') {
    // Redirect to inbox if logged in
    if (session)
      return navigateTo('/inbox')
  }
  else if (to.path === '/assistant' || to.path === '/thumb') {
    if (!is.desktop())
      return navigateTo('/404')
  }
})
