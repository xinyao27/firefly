import { getUser, is } from '@firefly/common'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/') {
    // Redirect to inbox if logged in
    if (await getUser()) {
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
    if (!(await getUser()))
      return navigateTo('/login')
  }
  else if (to.path === '/login' || to.path === '/signup') {
    // Redirect to inbox if logged in
    if (await getUser())
      return navigateTo('/inbox')
  }
  else if (to.path === '/assistant' || to.path === '/thumb') {
    if (!is.desktop())
      return navigateTo('/404')
  }
})
