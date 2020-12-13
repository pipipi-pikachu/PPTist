<template>
  <div :class="['border-line', type, { 'wide': isWide }]"></div>
</template>

<script lang="ts">
import { PropType } from 'vue'

type BorderLineType = 't' | 'b' | 'l' | 'r'

export default {
  name: 'border-line',
  props: {
    type: {
      type: String as PropType<BorderLineType>,
      required: true,
    },
    isWide: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.border-line {
  position: absolute;
  width: 0;
  height: 0;
  left: 0;
  top: 0;
  border: 0 dashed $themeColor;

  &.t {
    border-top-width: 1px;
  }
  &.b {
    border-bottom-width: 1px;
  }
  &.l {
    border-left-width: 1px;
  }
  &.r {
    border-right-width: 1px;
  }

  &.wide {
    &::before {
      content: '';
      position: absolute;
      background: transparent;
      cursor: move;
    }

    &.t::before {
      top: -8px;
      left: -8px;
      width: calc(100% + 16px);
      height: 16px;
    }
    &.b::before {
      bottom: -8px;
      left: -8px;
      width: calc(100% + 16px);
      height: 16px;
    }
    &.l::before {
      top: -8px;
      left: -8px;
      width: 16px;
      height: calc(100% + 16px);
    }
    &.r::before {
      top: -8px;
      right: -8px;
      width: 16px;
      height: calc(100% + 16px);
    }
  }
}
</style>