<template>
  <div :class="['divider', type]"
    :style="{
      margin: type === 'horizontal' ? `${margin >= 0 ? margin : 24}px 0` : `0 ${margin >= 0 ? margin : 8}px`
    }"
  ></div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  type?: 'horizontal' | 'vertical'
  margin?: number
}>(), {
  type: 'horizontal',
  margin: -1,
})
</script>

<style lang="scss" scoped>
.divider {
  &.horizontal {
    width: 100%;
    margin: 24px 0;
    border-block-start: 1px solid rgba(5, 5, 5, .06);
  }
  &.vertical {
    position: relative;
    height: 1em;
    display: inline-block;
    margin: 0 8px;
    border-inline-start: 1px solid rgba(5, 5, 5, .06);
  }
}
</style>