import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './registerServiceWorker'

import '@icon-park/vue-next/styles/index.css'
import 'prosemirror-view/style/prosemirror.css'
import 'animate.css'

import '@/assets/styles/prosemirror.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/antd.scss'
import '@/assets/styles/font.scss'

import Icon from '@/plugins/icon'
import Directive from '@/plugins/directive'

import cn from '@/locales/cn.json'
import en from '@/locales/en.json'

const app = createApp(App)
const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  legacy: false,
  messages: {
    cn: cn,
    en: en
  }
})

app.use(Icon)
app.use(Directive)
app.use(i18n)

app.use(createPinia())
app.mount('#app')
