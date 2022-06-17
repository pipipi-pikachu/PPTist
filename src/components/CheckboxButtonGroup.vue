<template>
  <div class="checkbox-button-group">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.checkbox-button-group {
  display: flex;
  align-items: center;

  ::v-deep(.checkbox-button) {
    border-radius: 0;
    border-left-width: 0;
    border-right-width: 0;
    display: inline-block;

    & + .checkbox-button {
      border-left-width: 1px;
    }

    &:first-child {
      border-top-left-radius: $borderRadius;
      border-bottom-left-radius: $borderRadius;
      border-left-width: 1px;
    }

    &:last-child {
      border-top-right-radius: $borderRadius;
      border-bottom-right-radius: $borderRadius;
      border-right-width: 1px;
    }
  }
}
</style>