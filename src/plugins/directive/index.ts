import type { App } from 'vue'

import Contextmenu from './contextmenu'
import ClickOutside from './clickOutside'
import Tooltip from './tooltip'

export default {
  install(app: App) {
    app.directive('contextmenu', Contextmenu)
    app.directive('click-outside', ClickOutside)
    app.directive('tooltip', Tooltip)
  }
}
