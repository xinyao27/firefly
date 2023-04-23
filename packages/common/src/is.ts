export const is = {
  desktop: () => typeof window !== 'undefined' && window['__TAURI__' as any] !== undefined,
  macOS: () => typeof window !== 'undefined' && navigator.userAgent.includes('Mac OS X'),
  linux: () => typeof window !== 'undefined' && navigator.userAgent.includes('Linux'),
  windows: () => typeof window !== 'undefined' && navigator.userAgent.includes('Windows'),
  client: () => typeof window !== 'undefined',
  // @ts-expect-error noop
  development: () => import.meta.env.DEV || import.meta.env.MODE === 'development' || process.env.NODE_ENV === 'development',
  // @ts-expect-error noop
  production: () => import.meta.env.PROD || import.meta.env.MODE === 'production' || process.env.NODE_ENV === 'production',
}
