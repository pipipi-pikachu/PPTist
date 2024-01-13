<template>
  <div :class="`mouse-selection quadrant-${quadrant}`"
    :style="{
      top: top + 'px',
      left: left + 'px',
      width: width + 'px',
      height: height + 'px',
    }"
  ></div>
</template>

<script lang="ts" setup>
defineProps<{
  top: number
  left: number
  width: number
  height: number
  quadrant: number
}>()
</script>

<style lang="scss" scoped>
.mouse-selection {
  position: absolute;
  background-color: rgba($themeColor, 0.1);
  border: 1px solid $themeColor;
  z-index: 200;

  &.quadrant-1 {
    transform-origin: 50% 0;
    transform: rotate(180deg);
  }
  &.quadrant-2 {
    transform-origin: 0 0;
    transform: rotate(180deg);
  }
  &.quadrant-3 {
    transform-origin: 0 50%;
    transform: rotate(180deg);
  }
  &.quadrant-4 {
    transform-origin: 0 0;
    transform: rotate(0deg);
  }
}
</style>