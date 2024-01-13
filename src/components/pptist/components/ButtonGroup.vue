<template>
  <div class="button-group" :class="{ 'passive': passive }" ref="groupRef">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  passive?: boolean
}>(), {
  passive: false,
})
</script>

<style lang="scss" scoped>
.button-group {
  display: flex;
  align-items: center;

  ::v-deep(button.button) {
    border-radius: 0;
    border-left-width: 1px;
    border-right-width: 0;
    display: inline-block;
  }

  &:not(.passive) {
    ::v-deep(button.button) {
      &:not(:last-child, .radio, .checkbox):hover {
        position: relative;

        &::after {
          content: '';
          width: 1px;
          height: calc(100% + 2px);
          background-color: $themeColor;
          position: absolute;
          top: -1px;
          right: -1px;
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
  &.passive {
    ::v-deep(button.button) {
      &:not(.last, .radio, .checkbox):hover {
        position: relative;

        &::after {
          content: '';
          width: 1px;
          height: calc(100% + 2px);
          background-color: $themeColor;
          position: absolute;
          top: -1px;
          right: -1px;
        }
      }

      &.first {
        border-top-left-radius: $borderRadius;
        border-bottom-left-radius: $borderRadius;
        border-left-width: 1px;
      }

      &.last {
        border-top-right-radius: $borderRadius;
        border-bottom-right-radius: $borderRadius;
        border-right-width: 1px;
      }
    }
  }
}
</style>