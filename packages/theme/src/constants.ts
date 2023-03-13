import type { GlobalThemeOverrides } from 'naive-ui'
import { colors } from 'unocss/preset-mini'

export const primaryColor = {
  default: '#ff8787',
  hover: '#ff8787aa',
  active: '#ff87877f',
}

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: primaryColor.default,
    primaryColorHover: primaryColor.hover,
    primaryColorPressed: primaryColor.active,
    primaryColorSuppl: primaryColor.default,
  },
  Tooltip: {
    padding: '4px 6px',
    peers: { Popover: { arrowHeight: '0' } },
  },
  Card: {
    colorEmbedded: colors.neutral[50],
  },
  Drawer: {
    bodyPadding: '0',
  },
}
