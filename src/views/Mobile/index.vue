<template>
  <div class="mobile">
    <component 
      :is="currentComponent" 
      :changeMode="changeMode"
    ></component>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Mode } from '@/types/mobile'

import MobileEditor from './MobileEditor/index.vue'
import MobilePlayer from './MobilePlayer.vue'
import MobilePreview from './MobilePreview.vue'

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
</script>

<style lang="scss" scoped>
.mobile {
  height: 100%;
}
</style>