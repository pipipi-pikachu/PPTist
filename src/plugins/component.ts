import { App } from 'vue'

import FileInput from '@/components/FileInput.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import CheckboxButtonGroup from '@/components/CheckboxButtonGroup.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import MoveablePanel from '@/components/MoveablePanel.vue'

const components = {
  FileInput,
  CheckboxButton,
  CheckboxButtonGroup,
  ColorPicker,
  FullscreenSpin,
  MoveablePanel,
}

export default {
  install(app: App) {
    for (const key of Object.keys(components)) {
      app.component(key, components[key])
    }
  }
}
