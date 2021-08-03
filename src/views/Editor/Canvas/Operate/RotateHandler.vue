<template>
  <IconRotateOne size="10" class="rotate-handler" />
</template>

<script lang="ts">
export default {
  name: 'rotate-handler',
}
</script>

<style lang="scss" scoped>
.rotate-handler {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -25px;
  margin-left: -5px;
  color: $themeColor;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}
</style>