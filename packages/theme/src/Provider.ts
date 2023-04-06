import type { FunctionalComponent } from 'vue'
import { h } from 'vue'
import { NConfigProvider, NDialogProvider, NMessageProvider, darkTheme } from 'naive-ui'
import { themeOverrides } from './constants'

export const ThemeProvider: FunctionalComponent = (_, { slots }) => {
  return h(
    NConfigProvider,
    {
      class: 'h-full',
      theme: darkTheme,
      themeOverrides,
    },
    () => h(
      NMessageProvider,
      {
        keepAliveOnHover: true,
        containerStyle: { top: '52px' },
        placement: 'top-right',
      },
      () => h(
        NDialogProvider,
        null,
        () => slots.default?.(),
      ),
    ),
  )
}
