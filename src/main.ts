import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import '@icon-park/vue-next/styles/index.css'
import 'prosemirror-view/style/prosemirror.css'
import 'animate.css'
import '@/assets/styles/prosemirror.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/font.scss'

import Icon from '@/plugins/icon'
import Directive from '@/plugins/directive'

const pathPattern = /^\/documents\/[^/]+$/;
if (pathPattern.test(window.location.pathname)) {
  const app = createApp(App)
  app.use(Icon)
  app.use(Directive)
  app.use(createPinia())
  app.mount('#app')
} else {
  // Show error page
  document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px;color:red;">404 - Page Not Found</h1>';
}
