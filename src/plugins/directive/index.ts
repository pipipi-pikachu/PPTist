import { App } from 'vue'

import Contextmenu from './contextmenu'
import ClickOutside from './clickOutside'

export default {
  install(app: App) {
    app.directive('contextmenu', Contextmenu)
    app.directive('click-outside', ClickOutside)
  }
}
