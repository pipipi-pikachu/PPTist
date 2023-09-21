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

  ::v-deep(.button) {
    border-radius: 0;
    border-left-width: 0;
    border-right-width: 0;
    display: inline-block;

    & + .button {
      border-left-width: 1px;
    }

    &:hover {
      &.default + .button.default {
        border-left-color: $themeColor;
      }
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