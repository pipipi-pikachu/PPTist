import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { t } from '@/i18n'

import 'prosemirror-view/style/prosemirror.css'
import 'animate.css'
import '@/assets/styles/prosemirror.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/font.scss'

import Directive from '@/directive'

const app = createApp(App)
app.config.globalProperties.t = t
app.use(Directive)
app.use(createPinia())
app.mount('#app')
