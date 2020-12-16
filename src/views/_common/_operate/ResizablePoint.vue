<template>
  <div :class="['resizable-point', type]"></div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { OperateResizablePointType } from '@/types/edit'

export default {
  name: 'resizable-point',
  props: {
    type: {
      type: String as PropType<OperateResizablePointType>,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.resizable-point {
  position: absolute;
  width: 10px;
  height: 10px;
  left: 0;
  top: 0;
  margin: -5px 0 0 -5px;
  border: 1px solid #666;
  background-color: #fff;
  border-radius: 50%;

  &.t-l {
    cursor: nwse-resize;
  }
  &.t-c {
    cursor: ns-resize;
  }
  &.t-r {
    cursor: nesw-resize;
  }
  &.m-l {
    cursor: ew-resize;
  }
  &.m-r {
    cursor: ew-resize;
  }
  &.b-l {
    cursor: nesw-resize;
  }
  &.b-c {
    cursor: ns-resize;
  }
  &.b-r {
    cursor: nwse-resize;
  }
  &.any {
    cursor: pointer;
  }
}
</style>