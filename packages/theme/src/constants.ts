import type { GlobalThemeOverrides } from 'naive-ui'
import { colors } from 'unocss/preset-mini'

export const colorPrimary = {
  default: '#18C7FE',
  hover: '#18C7FEaa',
  active: '#18C7FE7f',
}
export const colorDark = 'rgba(33,33,33,.9)'
export const colorBlack = 'rgba(22,22,22,.9)'
const colorSlate15 = 'rgba(148,163,184,.15)'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: colorPrimary.default,
    primaryColorHover: colorPrimary.hover,
    primaryColorPressed: colorPrimary.active,
    primaryColorSuppl: colorPrimary.default,
    warningColor: colors.yellow[500],
    warningColorHover: colors.yellow[600],
    warningColorPressed: colors.yellow[700],
    warningColorSuppl: colors.yellow[500],
    successColor: colors.green[500],
    successColorHover: colors.green[600],
    successColorPressed: colors.green[700],
    successColorSuppl: colors.green[500],
    errorColor: colors.red[500],
    errorColorHover: colors.red[600],
    errorColorPressed: colors.red[700],
    errorColorSuppl: colors.red[500],
    infoColor: colors.blue[500],
    infoColorHover: colors.blue[600],
    infoColorPressed: colors.blue[700],
    infoColorSuppl: colors.blue[500],

    modalColor: colorDark,
    bodyColor: colorDark,
    cardColor: colorDark,
    popoverColor: colorBlack,
  },
  Popover: {
    padding: '0',
  },
  Tooltip: {
    peers: {
      Popover: {
        arrowHeight: '0',
        color: colorBlack,
        padding: '4px 6px',
      },
    },
  },
  Card: {
    color: colorBlack,
    colorModal: colorBlack,
    titleFontSizeSmall: '14px',
    titleTextColor: colors.neutral[500],
  },
  Drawer: {
    bodyPadding: '0',
  },
  Breadcrumb: {
    separatorColor: colorSlate15,
  },
  Menu: {
    itemHeight: '28px',
  },
}
