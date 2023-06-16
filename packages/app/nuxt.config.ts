import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { langMap } from '@firefly/common'
import { pwa } from './config/pwa'
import { appDescription, appName } from './constants/index'
import pkg from './package.json'
import type { LocaleObject } from '#i18n'

const availableLocales = Array.from(langMap.keys())
const locales = availableLocales.map<LocaleObject>(locale => ({
  code: locale,
  name: langMap.get(locale) ?? locale,
  file: `${locale}.yml`,
}))

const plugins = [
  AutoImport({
    imports: [
      {
        'naive-ui': [
          'useDialog',
          'useMessage',
          'useNotification',
          'useLoadingBar',
        ],
      },
    ],
  }),
  Components({
    resolvers: [NaiveUiResolver()], // 全自动按需引入naive-ui组件
  }),
]
const modules = [
  '@vueuse/nuxt',
  '@unocss/nuxt',
  '@pinia/nuxt',
  '@nuxtjs/i18n',
  '@vue-macros/nuxt',
  'nuxt-gtag',
]
if (process.env.SENTRY_AUTH_TOKEN && process.env.NODE_ENV === 'production') {
  plugins.push(
    // https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/
    sentryVitePlugin({
      org: 'fireflybest',
      project: 'app',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  )
}
if (process.env.ELECTRON)
  modules.push('nuxt-electron')
else
  modules.push('@vite-pwa/nuxt')

export default defineNuxtConfig({
  srcDir: 'src',

  imports: {
    dirs: [
      'composables',
      'stores',
    ],
  },

  modules,

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
  },

  css: [
    '~/styles/normalize.css',
  ],

  routeRules: {
    '/assistant': { ssr: false },
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/', '/redirect'],
      ignore: ['/inbox'],
    },
    experimental: {
      wasm: true,
    },
  },

  app: {
    head: {
      title: appName,
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/128x128.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'msapplication-TileColor', content: '#212121' },
        { name: 'theme-color', content: '#212121' },

        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        // open graph social image
        { property: 'title', content: appName },
        { property: 'description', content: appDescription },
        { property: 'og:title', content: appName },
        { property: 'og:description', content: appDescription },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://firefly.best/hero.png' },
        { property: 'og:image:width', content: '3800' },
        { property: 'og:image:height', content: '1900' },
        { property: 'og:site_name', content: appName },
        { property: 'twitter:site', content: '@FireflyBest' },
        { property: 'twitter:card', content: 'summary_large_image' },
      ],
    },
  },

  electron: {
    build: [
      {
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              external: ['@chenyueban/robot'],
            },
          },
        },
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload()
        },
      },
    ],
    renderer: {},
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
  unocss: {
    preflight: false,
  },
  pwa,
  i18n: {
    lazy: true,
    locales,
    langDir: './locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
  },
  gtag: {
    id: 'G-MRKG78WD9B',
  },

  devtools: {
    enabled: true,
  },

  runtimeConfig: {
    public: {
      APP_VERSION: pkg.version,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_FUNCTIONS_URL: process.env.SUPABASE_FUNCTIONS_URL,
      SENTRY_DSN: process.env.SENTRY_DSN,
    },
  },

  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
            'naive-ui',
            'vueuc',
            '@css-render/vue3-ssr',
            '@juggle/resize-observer',
          ]
        : ['@juggle/resize-observer'],
  },
  vite: {
    clearScreen: false,
    server: {
      strictPort: true,
    },
    plugins,
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
          : [],
    },
  },
})
