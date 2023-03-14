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
  Layout: {
    color: colors.neutral[50],
    headerColor: colors.neutral[50],
    siderColor: colors.neutral[50],
  },
  Tooltip: {
    padding: '4px 6px',
    peers: { Popover: { arrowHeight: '0' } },
  },
  Card: {
    colorEmbedded: colors.neutral[50],
    titleFontSizeSmall: '14px',
  },
  Drawer: {
    bodyPadding: '0',
  },
}
