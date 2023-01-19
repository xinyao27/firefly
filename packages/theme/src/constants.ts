import type { GlobalThemeOverrides } from 'naive-ui'
import { colors } from 'unocss/preset-mini'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    // @ts-expect-error noop
    primaryColor: colors?.blue['500'],
    // @ts-expect-error noop
    primaryColorHover: colors?.blue['400'],
    // @ts-expect-error noop
    primaryColorPressed: colors?.blue['600'],
    // @ts-expect-error noop
    primaryColorSuppl: colors?.blue['500'],
  },
  Layout: {
    // @ts-expect-error noop
    color: colors?.dark['700'],
    // @ts-expect-error noop
    headerColor: colors?.dark['700'],
    // @ts-expect-error noop
    siderColor: colors?.dark['700'],
  },
  Tooltip: {
    padding: '4px 8px',
    // @ts-expect-error noop
    fontSize: '12px',
    // @ts-expect-error noop
    color: colors?.dark['900'],
  },
}
