// eslint-disable-next-line import/no-mutable-exports
export let desktop: typeof import('electron')

export default defineNuxtPlugin(async () => {
  if (process.server) {
    // @ts-expect-error noop
    desktop = {}
  }
  else {
    desktop = await import('electron')
  }
})
