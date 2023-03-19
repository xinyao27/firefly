import type { FunctionalComponent } from 'vue'
import { h } from 'vue'
import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui'
import { themeOverrides } from './constants'

export const ThemeProvider: FunctionalComponent = (_, { slots }) => {
  return h(
    NConfigProvider,
    {
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
