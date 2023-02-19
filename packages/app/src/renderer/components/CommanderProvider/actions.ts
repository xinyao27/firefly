import { createAction } from '@bytebase/vue-kbar'

export const actions = [
  createAction({
    id: 'home',
    name: 'Home',
    shortcut: ['g', 'h'],
    section: 'Navigation',
    subtitle: 'Go back to home',
    perform: () => {
      $router.push('/')
    },
  }),
  createAction({
    id: 'editor',
    name: 'Editor',
    shortcut: ['g', 'e'],
    section: 'Navigation',
    perform: () => {
      $router.push('/text-editor')
    },
  }),
]
