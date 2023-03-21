export const is = {
  isDesktop: () => window['__TAURI__' as any] !== undefined,
  isMacOS: () => navigator.userAgent.includes('Mac OS X'),
  isLinux: () => navigator.userAgent.includes('Linux'),
  isWindows: () => navigator.userAgent.includes('Windows'),
}
