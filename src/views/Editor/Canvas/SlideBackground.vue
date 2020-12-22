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
import { Slide } from '@/types/slides'
import GridLines from './GridLines.vue'

export default defineComponent({
  name: 'slide-background',
  components: {
    GridLines,
  },
  setup() {
    const store = useStore<State>()
    const showGridLines = computed(() => store.state.showGridLines)
    const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

    const backgroundStyle = computed(() => {
      if(!currentSlide.value.background) return { backgroundColor: '#fff' }

      const [type, value] = currentSlide.value.background
      if(type === 'solid') return { backgroundColor: value }
      else if(type === 'image') return { backgroundImage: `url(${value}` }

      return { backgroundColor: '#fff' }
    })

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
