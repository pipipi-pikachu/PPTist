import { App } from 'vue'

import FileInput from '@/components/FileInput.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import CheckboxButtonGroup from '@/components/CheckboxButtonGroup.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'

export default {
  install(app: App) {
    app.component('FileInput', FileInput)
    app.component('CheckboxButton', CheckboxButton)
    app.component('CheckboxButtonGroup', CheckboxButtonGroup)
    app.component('ColorPicker', ColorPicker)
    app.component('FullscreenSpin', FullscreenSpin)
  }
}
