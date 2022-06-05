<template>
  <div class="mobile">
    <component 
      :is="currentComponent" 
      :changeMode="changeMode"
    ></component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { Mode } from '@/types/mobile'

import MobileEditor from './MobileEditor/index.vue'
import MobilePlayer from './MobilePlayer.vue'
import MobilePreview from './MobilePreview.vue'

export default defineComponent({
  name: 'mobile',
  setup() {
    const mode = ref<Mode>('preview')
    
    const changeMode = (_mode: Mode) => mode.value = _mode
    
    const currentComponent = computed(() => {
      const componentMap = {
        'editor': MobileEditor,
        'player': MobilePlayer,
        'preview': MobilePreview,
      }
      return componentMap[mode.value] || null
    })

    return {
      currentComponent,
      changeMode,
    }
  },
})
</script>

<style lang="scss" scoped>
.mobile {
  height: 100%;
}
</style>