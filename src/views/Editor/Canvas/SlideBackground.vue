<template>
  <div 
    class="slide-background"
    :style="backgroundStyle"
  >
    <GridLines v-if="showGridLines" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import { SlideBackground } from '@/types/slides'
import GridLines from './GridLines.vue'
import useSlideBackgroundStyle from '@/hooks/useSlideBackgroundStyle'

export default defineComponent({
  name: 'slide-background',
  components: {
    GridLines,
  },
  setup() {
    const store = useStore()
    const showGridLines = computed(() => store.state.showGridLines)
    const background = computed<SlideBackground | undefined>(() => store.getters.currentSlide?.background)

    const { backgroundStyle } = useSlideBackgroundStyle(background)

    return {
      showGridLines,
      backgroundStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.slide-background {
  width: 100%;
  height: 100%;
  background-position: center;
  position: absolute;
}
</style>
