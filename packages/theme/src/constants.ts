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
    color: colors.dark['500'],
    headerColor: colors.dark['500'],
    headerBorderColor: colors.neutral[700],
    siderColor: colors.dark['500'],
    siderBorderColor: colors.neutral[700],
  },
  Tooltip: {
    color: colors.neutral[100],
    textColor: colors.dark[900],
    padding: '4px 6px',
    peers: { Popover: { arrowHeight: '0' } },
  },
  Dialog: { color: colors.dark['600'] },
  Dropdown: { color: colors.dark[400] },
}
