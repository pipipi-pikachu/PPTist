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
import { AlignmentLineAxis } from '@/types/edit'

export default {
  name: 'alignment-line',
  props: {
    type: {
      type: String as PropType<'vertical' | 'horizontal'>,
      required: true,
    },
    axis: {
      type: Object as PropType<AlignmentLineAxis>,
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