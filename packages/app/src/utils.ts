import { is } from '@firefly/common'

export function parseSchema(link: string) {
  const { protocol, pathname, hostname, searchParams } = new URL(link)

  if (protocol !== 'firefly:')
    return null

  if (is.macOS() ? hostname === 'redirect' : pathname.startsWith('//redirect')) {
    const access_token = searchParams.get('access_token')
    const refresh_token = searchParams.get('refresh_token')
    return {
      access_token,
      refresh_token,
    }
  }

  return null
}
