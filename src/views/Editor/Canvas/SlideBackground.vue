<template>
  <div 
    class="slide-background"
    :style="backgroundStyle"
  >
    <template v-if="isShowGridLines">
      <GridLines />
      <GridLines :gridSize="100" gridColor="rgba(100, 100, 100, 0.3)" />
    </template>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import GridLines from './GridLines'

export default defineComponent({
  name: 'slide-background',
  components: {
    GridLines,
  },
  props: {
    background: {
      type: Array,
    },
    isShowGridLines: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const backgroundStyle = computed(() => {
      if(!props.background) return { backgroundColor: '#fff' }

      const [type, value] = props.background
      if(type === 'solid') return { backgroundColor: value }
      else if(type === 'image') return { backgroundImage: `url(${value}` }

      return { backgroundColor: '#fff' }
    })

    return {
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
