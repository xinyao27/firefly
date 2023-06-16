export const is = {
  desktop: () => !!process.type,
  renderer: () => process.type === 'renderer',
  main: () => process.type === 'browser',
  macOS: () => process.platform === 'darwin',
  linux: () => process.platform === 'linux',
  windows: () => process.platform === 'win32',
  client: () => typeof window !== 'undefined',
  // @ts-expect-error noop
  development: () => import.meta.env.DEV || import.meta.env.MODE === 'development' || process.env.NODE_ENV === 'development',
  // @ts-expect-error noop
  production: () => import.meta.env.PROD || import.meta.env.MODE === 'production' || process.env.NODE_ENV === 'production',
}
