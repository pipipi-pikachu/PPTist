<template>
  <div :class="['resize-handler', type]"></div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { OperateResizeHandler } from '@/types/edit'

export default {
  name: 'resize-handler',
  props: {
    type: {
      type: String as PropType<OperateResizeHandler>,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.resize-handler {
  position: absolute;
  width: 10px;
  height: 10px;
  left: 0;
  top: 0;
  margin: -5px 0 0 -5px;
  border: 1px solid $themeColor;
  background-color: #fff;
  border-radius: 1px;

  &.left-top {
    cursor: nwse-resize;
  }
  &.top {
    cursor: ns-resize;
  }
  &.right-top {
    cursor: nesw-resize;
  }
  &.left {
    cursor: ew-resize;
  }
  &.right {
    cursor: ew-resize;
  }
  &.left-bottom {
    cursor: nesw-resize;
  }
  &.bottom {
    cursor: ns-resize;
  }
  &.right-bottom {
    cursor: nwse-resize;
  }
}
</style>