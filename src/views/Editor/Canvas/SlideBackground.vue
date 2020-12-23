<template>
  <div 
    class="slide-background"
    :style="backgroundStyle"
  >
    <template v-if="showGridLines">
      <GridLines />
      <GridLines :gridSize="100" gridColor="rgba(100, 100, 100, 0.3)" />
    </template>
  </div>
</template>

<script lang="ts">
import { Ref, computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'
import GridLines from './GridLines.vue'
import useSlideBackgroundStyle from '@/hooks/useSlideBackgroundStyle'

export default defineComponent({
  name: 'slide-background',
  components: {
    GridLines,
  },
  setup() {
    const store = useStore<State>()
    const showGridLines = computed(() => store.state.showGridLines)
    const background: Ref<[string, string] | undefined> = computed(() => store.getters.currentSlide.background)

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
  background-size: cover;
  position: absolute;
}
</style>
