import type { FunctionalComponent } from 'vue'
import { h } from 'vue'
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'
import { themeOverrides } from './constants'

export const ThemeProvider: FunctionalComponent = (_, { slots }) => {
  return h(
    NConfigProvider,
    {
      theme: darkTheme,
      themeOverrides,
    },
    h(
      NMessageProvider,
      {
        keepAliveOnHover: true,
        containerStyle: { top: '52px' },
      },
      slots.default?.(),
    ),
  )
}
