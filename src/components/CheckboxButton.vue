<template>
  <button class="checkbox-button" :class="{ 'checked': checked }">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.checkbox-button {
  outline: 0;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  font-size: 13px;
  padding: 0 15px;
  height: 32px;
  text-align: center;
  cursor: pointer;

  &:hover {
    color: $themeColor;
  }

  &.checked {
    color: #fff;
    background-color: $themeColor;
    border-color: $themeColor;

    &:hover {
      background: rgba($color: $themeColor, $alpha: .9);
      border-color: rgba($color: $themeColor, $alpha: .9);
    }
  }
}
</style>