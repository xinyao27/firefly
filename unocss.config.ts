import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'
import { primaryColor } from './packages/theme/src/constants'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      cdn: 'https://esm.sh/',
    }),
    presetTypography(),
    presetRemToPx(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: primaryColor.default,
    },
  },
  shortcuts: [{
    'base-focus': 'focus:(bg-op-20 ring-0 outline-none)',
    'b-slate-link': 'border-b border-(slate none) hover:border-dashed',
    'btn-slate': 'h-12 px-4 py-2 bg-(slate op-15) hover:bg-op-20 rounded-sm',
    'textarea-slate': 'w-full px-3 py-3 min-h-12 max-h-36 leading-4 rounded-sm bg-(slate op-15) base-focus placeholder:op-50 dark:(placeholder:op-30) scroll-pa-8px',
  }],
})
