import type { GlobalThemeOverrides } from 'naive-ui'
import { colors } from 'unocss/preset-mini'

export const colorPrimary = {
  default: '#18C7FE',
  hover: '#18C7FEaa',
  active: '#18C7FE7f',
}
export const colorDark = '#212121'
const colorSlate15 = 'rgba(148,163,184,.15)'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: colorPrimary.default,
    primaryColorHover: colorPrimary.hover,
    primaryColorPressed: colorPrimary.active,
    primaryColorSuppl: colorPrimary.default,
    modalColor: colorDark,
    bodyColor: colorDark,
    cardColor: colorDark,
    popoverColor: colors.dark[800],
  },
  Popover: {
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
