import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { pwa } from './config/pwa'
import { i18n } from './config/i18n'
import { appDescription, appName } from './constants/index'
import pkg from './package.json'

const define = process.env.NODE_ENV === 'production'
  ? {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_FUNCTIONS_URL': JSON.stringify(process.env.VITE_SUPABASE_FUNCTIONS_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
    }
  : {}

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
if (process.env.SENTRY_AUTH_TOKEN && process.env.NODE_ENV === 'production') {
  plugins.push(
    // https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/
    sentryVitePlugin({
      org: 'fireflybest',
      project: 'app',

      // Specify the directory containing build artifacts
      include: './dist',

      // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
      // and needs the `project:releases` and `org:read` scopes
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  )
}

export default defineNuxtConfig({
  srcDir: 'src',

  imports: {
    dirs: [
      'composables',
      'stores',
    ],
  },

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
    '@vue-macros/nuxt',
    'nuxt-gtag',
    '~/modules/tauri/index',
  ],

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
  },

  css: [
    '~/styles/normalize.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: [],
    },
  },

  app: {
    head: {
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

  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
  unocss: {
    preflight: false,
  },
  pwa,
  i18n,
  gtag: {
    id: 'G-MRKG78WD9B',
  },

  devtools: {
    enabled: true,
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
    define: {
      ...define,
      'import.meta.env.APP_VERSION': JSON.stringify(pkg.version.toString()),
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
