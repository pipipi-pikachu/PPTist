import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import 'prosemirror-view/style/prosemirror.css'
import 'animate.css'
import '@/assets/styles/prosemirror.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/font.scss'

import Directive from '@/directive'
import { i18n } from '@/i18n'

const app = createApp(App)
app.use(Directive)
app.use(createPinia())
app.use(i18n)
app.mount('#app')
