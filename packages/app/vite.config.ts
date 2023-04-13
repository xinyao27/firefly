/// <reference types="vitest" />
import path from 'node:path'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Inspect from 'vite-plugin-inspect'
import Unocss from 'unocss/vite'
// @ts-expect-error noop
import VueMacros from 'unplugin-vue-macros/vite'
import { VitePWA } from 'vite-plugin-pwa'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import mkcert from 'vite-plugin-mkcert'
import Inspector from 'vite-plugin-vue-inspector'
import WebfontDownload from 'vite-plugin-webfont-dl'

import pkg from './package.json'

function resolve(...p: string[]) {
  return path.resolve(__dirname, ...p)
}

export default defineConfig(({ mode }) => {
  const isTauri = !!process.env.TAURI_PLATFORM
  const input: Record<string, string> = {
    main: resolve('index.html'),
  }
  if (isTauri) {
    input.assistant = resolve('assistant.html')
    input.thumb = resolve('thumb.html')
  }
  const plugins = [
    // https://github.com/liuweiGL/vite-plugin-mkcert
    mkcert({
      source: 'coding',
    }),

    VueMacros({
      plugins: {
        vue: Vue(),
      },
    }),

    VueJsx(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        'vue/macros',
        '@vueuse/head',
        '@vueuse/core',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
          ],
        },
      ],
      dts: resolve('src/auto-imports.d.ts'),
      dirs: [
        resolve('src/composables'),
        resolve('src/store'),
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      dirs: resolve('src/components'),
      dts: resolve('src/components.d.ts'),
      resolvers: [NaiveUiResolver()],
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [resolve('../..', 'locales/**')],
    }),

    // https://github.com/antfu/vite-plugin-inspect
    // Visit https://localhost:5173/__inspect/ to see the inspector
    Inspect(),

    // https://github.com/webfansplz/vite-plugin-vue-inspector
    Inspector({
      toggleButtonVisibility: 'never',
    }),

    // https://github.com/feat-agency/vite-plugin-webfont-dl
    WebfontDownload(),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      dirs: resolve('src/pages'),
      extensions: ['vue'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts({ layoutsDirs: resolve('src/layouts') }),

    // https://vite-pwa-org.netlify.app/guide/
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Firefly',
        short_name: 'Firefly',
        theme_color: '#212121',
        icons: [
          {
            src: '/128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: '/icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ]

  if (process.env.SENTRY_AUTH_TOKEN && mode === 'production') {
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
  const define = mode === 'production'
    ? {
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
        'import.meta.env.VITE_SUPABASE_FUNCTIONS_URL': JSON.stringify(process.env.VITE_SUPABASE_FUNCTIONS_URL),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
      }
    : {}

  const result: UserConfig = {
    clearScreen: false,
    server: {
      https: true,
      strictPort: true,
    },
    envPrefix: ['VITE_', 'TAURI_'],
    define: {
      ...define,
      'import.meta.env.APP_VERSION': JSON.stringify(pkg.version.toString()),
    },
    build: {
      sourcemap: true,
      target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
      minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
      rollupOptions: {
        input,
      },
    },
    resolve: {
      alias: {
        '~/': `${resolve('src')}/`,
      },
    },
    plugins,
    test: {
      environment: 'jsdom',
      deps: { inline: ['@vue', '@vueuse'] },
    },
  }

  return result
})
