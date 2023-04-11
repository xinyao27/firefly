import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import '@unocss/core'
import presetRemToPx from '@unocss/preset-rem-to-px'
import presetAutoprefixer from 'unocss-preset-autoprefixer'
import { colorPrimary } from './packages/theme/src/constants'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      cdn: 'https://esm.sh/',
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Lato',
        mono: ['Fira Code', 'Fira Mono:400,700'],
      },
    }),
    presetTypography(),
    presetRemToPx(),
    presetAutoprefixer(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: colorPrimary.default,
    },
  },
  shortcuts: [{
    'base-focus': 'focus:(bg-opacity-20 ring-0 outline-none)',
    'btn-slate': 'h-12 px-4 py-2 bg-(slate opacity-15) hover:bg-opacity-20 rounded-sm',
    'textarea-slate': 'w-full max-w-full px-3 py-3 min-h-12 max-h-36 leading-4 rounded-sm bg-(slate opacity-15) base-focus placeholder:opacity-50 dark:(placeholder:opacity-30) scroll-pa-8px',
  }],
})
