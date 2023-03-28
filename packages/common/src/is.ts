export const is = {
  desktop: () => window['__TAURI__' as any] !== undefined,
  macOS: () => navigator.userAgent.includes('Mac OS X'),
  linux: () => navigator.userAgent.includes('Linux'),
  windows: () => navigator.userAgent.includes('Windows'),
  // @ts-expect-error noop
  development: () => import.meta.env.DEV || import.meta.env.MODE === 'development' || process.env.NODE_ENV === 'development',
  // @ts-expect-error noop
  production: () => import.meta.env.PROD || import.meta.env.MODE === 'production' || process.env.NODE_ENV === 'production',
}
