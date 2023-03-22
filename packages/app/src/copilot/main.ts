import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

import 'uno.css'
import '../styles/normalize.css'
import '../styles/main.sass'

const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const setting = localStorage.getItem('vueuse-color-scheme') || 'auto'
if (setting === 'dark' || (prefersDark && setting !== 'light'))
  document.documentElement.classList.toggle('dark', true)

document.oncontextmenu = () => false

const i18n = createI18n({
  legacy: false,
  locale: 'en',
})

const app = createApp(App)
app.use(i18n)

app.mount('#app')
