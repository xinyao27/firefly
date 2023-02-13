import { createAction } from '@bytebase/vue-kbar'

export const actions = [
  createAction({
    id: 'home',
    name: 'Home',
    shortcut: ['g', 'h'],
    section: 'Navigation',
    subtitle: 'Go back to home',
    perform: () => {},
  }),
  createAction({
    id: 'docs',
    name: 'Docs',
    shortcut: ['g', 'd'],
    section: 'Navigation',
    perform: () => {},
  }),
]
