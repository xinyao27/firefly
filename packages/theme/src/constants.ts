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
    headerBorderColor: colors.neutral[700],
    siderColor: colors.dark['700'],
    siderBorderColor: colors.neutral[700],
  },
  Tooltip: {
    color: colors.neutral[100],
    textColor: colors.dark[900],
    padding: '4px 6px',
    peers: { Popover: { arrowHeight: '0' } },
  },
  Dialog: { color: colors.dark['600'] },
}
