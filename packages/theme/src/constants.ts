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
    color: colors.dark['800'],
    headerColor: colors.dark['600'],
    siderColor: colors.dark['600'],
  },
  Tooltip: { peers: { Popover: { arrowHeight: '0' } } },
  Dialog: { color: colors.dark['600'] },
}
