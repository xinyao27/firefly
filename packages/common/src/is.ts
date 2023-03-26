export const is = {
  desktop: () => window['__TAURI__' as any] !== undefined,
  macOS: () => navigator.userAgent.includes('Mac OS X'),
  linux: () => navigator.userAgent.includes('Linux'),
  windows: () => navigator.userAgent.includes('Windows'),
}
