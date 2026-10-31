<template>
  <div class="line-connection-point" :style="{ left: x + 'px', top: y + 'px' }"></div>
</template>

<script lang="ts" setup>
defineProps<{
  x: number
  y: number
}>()
</script>

<style lang="scss" scoped>
.line-connection-point {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid $themeColor;
  background-color: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 102;
}
</style>
