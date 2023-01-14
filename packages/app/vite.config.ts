/// <reference types="vitest" />
import path from 'node:path'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Preview from 'vite-plugin-vue-component-preview'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Inspect from 'vite-plugin-inspect'
import Unocss from 'unocss/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import pkg from './package.json'

const isDevelopment = process.env.NODE_ENV === 'development' || !!process.env.VSCODE_DEBUG
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  server: process.env.VSCODE_DEBUG
    ? (() => {
      const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
      return {
        host: url.hostname,
        port: +url.port,
      }
    })()
    : undefined,
  clearScreen: false,

  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '~~/': `${path.resolve(__dirname)}/`,
    },
  },

  plugins: [
    Preview(),

    VueMacros({
      plugins: {
        vue: Vue({
          include: [/\.vue$/],
          reactivityTransform: true,
        }),
      },
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        'vue/macros',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/store',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ['vue'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/components.d.ts',
      resolvers: [NaiveUiResolver()],
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    // https://github.com/antfu/vite-plugin-inspect
    // Visit http://localhost:3333/__inspect/ to see the inspector
    Inspect(),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({ extensions: ['vue'] }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
        onstart(options) {
          if (process.env.VSCODE_DEBUG) {
            // eslint-disable-next-line no-console
            console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
          }
          else {
            options.startup()
          }
        },
        vite: {
          build: {
            sourcemap: isDevelopment,
            minify: isProduction,
            outDir: 'dist-electron',
            rollupOptions: { external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}) },
          },
        },
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload()
        },
        vite: {
          build: {
            sourcemap: isDevelopment,
            minify: isProduction,
            outDir: 'dist-electron',
            rollupOptions: { external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}) },
          },
        },
      },
      {
        entry: 'electron/server.ts',
        onstart(options) {
          options.reload()
        },
        vite: {
          build: {
            sourcemap: isDevelopment,
            minify: isProduction,
            outDir: 'dist-electron',
            rollupOptions: { external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}) },
          },
        },
      },
    ]),
    // Use Node.js API in the Renderer-process
    renderer({
      nodeIntegration: true,
      optimizeDeps: { include: ['fs-extra', 'electron-log', 'electron-clipboard-ex'] },
    }),
  ],

  test: {
    environment: 'jsdom',
    deps: { inline: ['@vue', '@vueuse'] },
  },
})
