import { rm } from 'node:fs/promises'
import { addImportsSources, createResolver, defineNuxtModule, useNuxt } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'tauri',
  },
  setup() {
    const nuxt = useNuxt()
    const { resolve } = createResolver(import.meta.url)

    if (!process.env.TAURI_PLATFORM)
      return

    if (nuxt.options.dev)
      nuxt.options.ssr = false

    nuxt.options.pwa!.disable = true
    nuxt.options.sourcemap.client = false

    nuxt.hook('vite:extend', ({ config }) => {
      config.build!.target = ['chrome100', 'safari15']
      config.envPrefix = [...config.envPrefix || [], 'VITE_', 'TAURI_']
    })

    // prevent creation of server routes
    nuxt.hook('nitro:config', (config) => {
      config.srcDir = './_nonexistent'
      config.scanDirs = []
    })

    addImportsSources({
      from: 'h3',
      imports: ['defineEventHandler', 'getQuery', 'getRouterParams', 'readBody', 'sendRedirect'] as Array<keyof typeof import('h3')>,
    })

    nuxt.options.imports.dirs = nuxt.options.imports.dirs || []
    nuxt.options.imports.dirs.push(resolve('../../server/utils'))

    // cleanup files copied from the public folder that we don't need
    nuxt.hook('close', async () => {
      await rm('.output/public/128x128.png')
      await rm('.output/public/hero.png')
      await rm('.output/public/icon.ico')
    })
  },
})
