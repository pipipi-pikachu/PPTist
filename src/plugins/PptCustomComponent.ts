import { App } from 'vue'
// 自定义插件
import Contextmenu from './contextmenu'
import ClickOutside from './clickOutside'
import FileInput from '@/components/FileInput.vue'
import SvgWrapper from '@/components/SvgWrapper.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import CheckboxButtonGroup from '@/components/CheckboxButtonGroup.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'

export default {
  install(app: App) {
    // 插入元素
    app.directive('contextmenu', Contextmenu)
    app.directive('click-outside', ClickOutside)
    app.component('FileInput', FileInput)
    app.component('SvgWrapper', SvgWrapper)
    app.component('CheckboxButton', CheckboxButton)
    app.component('CheckboxButtonGroup', CheckboxButtonGroup)
    app.component('ColorPicker', ColorPicker)
    app.component('FullscreenSpin', FullscreenSpin)
  }
}
