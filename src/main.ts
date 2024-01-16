import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import pptist from './components/pptist/index'

const pinia = createPinia()
window.pinia = pinia

const app = createApp(App)
app.use(pptist.Icon)
app.use(pptist.Directive)
app.use(pinia)
app.mount('#app')
