<template>
  <Button class="color-btn">
    <div class="color-block" :style="{ backgroundColor: color }"></div>
    <IconFont type="icon-down" class="color-btn-icon" />
  </Button>
</template>

<script lang="ts">
export default {
  name: 'color-button',
  props: {
    color: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.color-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}
.color-block {
  height: 20px;
  margin-left: 8px;
  flex: 1;
}
svg.color-btn-icon {
  width: 30px;
  font-size: 12px;
  margin-top: 2px;
  color: #bfbfbf;
}
</style>