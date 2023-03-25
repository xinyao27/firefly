import type { GlobalThemeOverrides } from 'naive-ui'
import { colors } from 'unocss/preset-mini'

export const colorPrimary = {
  default: '#87CEEB',
  hover: '#87CEEBaa',
  active: '#87CEEB7f',
}
const colorSlate15 = 'rgba(148,163,184,.15)'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: colorPrimary.default,
    primaryColorHover: colorPrimary.hover,
    primaryColorPressed: colorPrimary.active,
    primaryColorSuppl: colorPrimary.default,
  },
  Layout: {
    color: '#212121',
    headerColor: '#212121',
    siderColor: '#212121',
  },
  Popover: {
    color: 'transparent',
    boxShadow: 'none',
    padding: '0',
  },
  Tooltip: {
    peers: {
      Popover: {
        arrowHeight: '0',
        color: '#000',
        padding: '4px 6px',
      },
    },
  },
  Card: {
    titleFontSizeSmall: '14px',
    titleTextColor: colors.neutral[500],
  },
  Drawer: {
    bodyPadding: '0',
  },
  Breadcrumb: {
    separatorColor: colorSlate15,
  },
}
