// eslint-disable-next-line import/no-mutable-exports
export let tauri: typeof import('@tauri-apps/api')

export default defineNuxtPlugin(async () => {
  if (process.server) {
    // @ts-expect-error noop
    tauri = {}
  }
  else {
    tauri = await import('@tauri-apps/api')
    window.$tauri = tauri
  }
})
