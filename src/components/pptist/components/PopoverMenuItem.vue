<template>
  <div class="popover-menu-item" :class="{ 'center': center }" @click="emit('click')">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  center?: boolean
}>(), {
  center: false,
})

const emit = defineEmits<{
  (event: 'click'): void
}>()
</script>

<style lang="scss" scoped>
.popover-menu-item {
  min-width: 80px;
  padding: 6px 10px;
  border-radius: $borderRadius;
  font-size: 13px;
  cursor: pointer;

  &.center {
    text-align: center;
  }

  &:hover {
    background-color: #f1f1f1;
  }
  & + .popover-menu-item {
    margin-top: 2px;
  }
}
</style>