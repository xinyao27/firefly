export const is = {
  linux: process.platform === 'linux',
  macOS: process.platform === 'darwin',
  windows: process.platform === 'win32',
  production: process.env.NODE_ENV !== 'development',
  development: process.env.NODE_ENV === 'development',
}
