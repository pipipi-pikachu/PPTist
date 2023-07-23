<template>
  <div :class="['border-line', type, { 'wide': isWide }]"></div>
</template>

<script lang="ts" setup>
import type { OperateBorderLines } from '@/types/edit'

withDefaults(defineProps<{
  type: OperateBorderLines
  isWide?: boolean
}>(), {
  isWide: false
})
</script>

<style lang="scss" scoped>
.border-line {
  position: absolute;
  width: 0;
  height: 0;
  left: 0;
  top: 0;
  border: 0 dashed $themeColor;

  &.top {
    border-top-width: 1px;
  }
  &.bottom {
    border-bottom-width: 1px;
  }
  &.left {
    border-left-width: 1px;
  }
  &.right {
    border-right-width: 1px;
  }

  &.wide {
    &::before {
      content: '';
      position: absolute;
      background: transparent;
      cursor: move;
    }

    &.top::before {
      top: -8px;
      left: -8px;
      width: calc(100% + 16px);
      height: 16px;
    }
    &.bottom::before {
      bottom: -8px;
      left: -8px;
      width: calc(100% + 16px);
      height: 16px;
    }
    &.left::before {
      top: -8px;
      left: -8px;
      width: 16px;
      height: calc(100% + 16px);
    }
    &.right::before {
      top: -8px;
      right: -8px;
      width: 16px;
      height: calc(100% + 16px);
    }
  }
}
</style>