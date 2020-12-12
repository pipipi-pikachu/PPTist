<template>
  <div 
    class="grid-lines"
    :style="style"
  ></div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'grid-lines',
  props: {
    gridSize: {
      type: Number,
      default: 20,
    },
    gridColor: {
      type: String,
      default: 'rgba(100, 100, 100, 0.2)',
    },
  },
  setup(props) {
    const style = computed(() => {
      const gridSize = props.gridSize + 'px'
      const gridSpacing = props.gridSize - 1 + 'px'
      const gridColor = props.gridColor

      return {
        backgroundImage: `linear-gradient(transparent ${gridSpacing}, ${gridColor} ${gridSpacing}, ${gridColor} ${gridSize}), linear-gradient(90deg, transparent ${gridSpacing}, ${gridColor} ${gridSpacing}, ${gridColor} ${gridSize})`,
        backgroundSize: `${gridSize} ${gridSize}`,
      }
    })

    return {
      style,
    }
  },
})
</script>

<style lang="scss" scoped>
.grid-lines {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-position: 0 0;
}
</style>