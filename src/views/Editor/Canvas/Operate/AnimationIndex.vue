<template>
  <div class="animation-index">
    {{animationIndex}}
  </div>
</template>

<script lang="ts">
export default {
  name: 'animation-index',
  props: {
    animationIndex: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.animation-index {
  position: absolute;
  top: 0;
  left: -22px;
  font-size: 12px;
  width: 20px;
  height: 20px;
  background-color: #fff;
  color: #333;
  border: 1px solid #666;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3px;
}
</style>