import { createApp } from 'vue'
import App from './App.vue'
import i18nInstance from './i18n'

import 'uno.css'
import '../styles/normalize.css'
import '../styles/main.sass'

const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const setting = localStorage.getItem('vueuse-color-scheme') || 'auto'
if (setting === 'dark' || (prefersDark && setting !== 'light'))
  document.documentElement.classList.toggle('dark', true)

document.oncontextmenu = () => false

const app = createApp(App)
app.use(i18nInstance)

app.mount('#app')
