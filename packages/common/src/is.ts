export const is = {
  desktop: () => {
    if (typeof window !== 'undefined')
      return window['__TAURI__' as any] !== undefined

    return false
  },
  macOS: () => {
    if (typeof window !== 'undefined')
      return navigator.userAgent.includes('Mac OS X')

    return false
  },
  linux: () => {
    if (typeof window !== 'undefined')
      return navigator.userAgent.includes('Linux')

    return false
  },
  windows: () => {
    if (typeof window !== 'undefined')
      return navigator.userAgent.includes('Windows')

    return false
  },
  ssg: () => typeof window === 'undefined',
  // @ts-expect-error noop
  development: () => import.meta.env.DEV || import.meta.env.MODE === 'development' || process.env.NODE_ENV === 'development',
  // @ts-expect-error noop
  production: () => import.meta.env.PROD || import.meta.env.MODE === 'production' || process.env.NODE_ENV === 'production',
}
