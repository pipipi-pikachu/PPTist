<template>
  <div 
    class="alignment-line"
    :style="{
      left: axis.x + 'px',
      top: axis.y + 'px',
    }"
  >
    <div 
      :class="['line', type]" 
      :style="type === 'vertical' ? { height: length + 'px' } : { width: length + 'px' }"
    ></div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'

type AlignmentLineType = 'vertical' | 'horizontal'

interface Axis {
  x: number;
  y: number;
}

export default {
  name: 'alignment-line',
  props: {
    type: {
      type: String as PropType<AlignmentLineType>,
      required: true,
    },
    axis: {
      type: Object as PropType<Axis>,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.alignment-line {
  position: absolute;
  z-index: 100;

  .line {
    width: 0;
    height: 0;
    border: 0 dashed $themeColor;

    &.vertical {
      margin-left: -0.5px;
      border-left-width: 1px;
    }
    &.horizontal {
      margin-top: -0.5px;
      border-top-width: 1px;
    }
  }
}
</style>