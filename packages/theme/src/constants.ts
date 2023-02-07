// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import type { GlobalThemeOverrides } from 'naive-ui'
import { colors } from 'unocss/preset-mini'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: colors.blue['500'],
    primaryColorHover: colors.blue['400'],
    primaryColorPressed: colors.blue['600'],
    primaryColorSuppl: colors.blue['500'],
  },
  Layout: {
    color: colors.dark['700'],
    headerColor: colors.dark['700'],
    siderColor: colors.dark['700'],
  },
  Tooltip: { peers: { Popover: { arrowHeight: '0' } } },
  Dialog: { color: colors.dark['600'] },
}
