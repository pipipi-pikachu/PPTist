<template>
  <div class="rotate-handler"></div>
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
  border: 1px solid $themeColor;
  background-color: #fff;
  border-radius: 1px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}
</style>