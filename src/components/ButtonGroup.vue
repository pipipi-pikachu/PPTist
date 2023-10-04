<template>
  <div class="button-group">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.button-group {
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-right: 0;
  border-radius: $borderRadius;
  overflow: hidden;

  ::v-deep(.button) {
    border-radius: 0;
    border: 0;
    display: inline-block;
    position: relative;

    &::after {
      content: '';
      width: 1px;
      height: 100%;
      background-color: #d9d9d9;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>