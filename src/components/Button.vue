<template>
  <button 
    class="button"
    :class="{
      'disabled': disabled,
      'checked': !disabled && checked,
      'default': !disabled && type === 'default',
      'primary': !disabled && type === 'primary',
      'checkbox': !disabled && type === 'checkbox',
      'radio': !disabled && type === 'radio',
    }"
    @click="handleClick()"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  checked?: boolean
  disabled?: boolean
  type?: 'default' | 'primary' | 'checkbox' | 'radio'
}>(), {
  checked: false,
  disabled: false,
  type: 'default',
})

const emit = defineEmits<{
  (event: 'click'): void
}>()

const handleClick = () => {
  if (props.disabled) return
  emit('click')
}
</script>

<style lang="scss" scoped>
.button {
  height: 32px;
  line-height: 32px;
  outline: 0;
  font-size: 13px;
  padding: 0 15px;
  text-align: center;
  color: $textColor;
  border-radius: $borderRadius;
  user-select: none;
  letter-spacing: 1px;
  cursor: pointer;

  &.default {
    background-color: #fff;
    border: 1px solid #d9d9d9;
    color: $textColor;

    &:hover {
      color: $themeColor;
      border-color: $themeColor;
    }
  }
  &.primary {
    background-color: $themeColor;
    border: 1px solid $themeColor;
    color: #fff;

    &:hover {
      background-color: $themeHoverColor;
      border-color: $themeHoverColor;
    }
  }
  &.checkbox, &.radio {
    background-color: #fff;
    border: 1px solid #d9d9d9;
    color: $textColor;

    &:not(.checked):hover {
      color: $themeColor;
    }
  }
  &.checked {
    color: #fff;
    background-color: $themeColor;
    border-color: $themeColor;

    &:hover {
      background: $themeHoverColor;
      border-color: $themeHoverColor;
    }
  }
  &.disabled {
    background-color: #f5f5f5;
    border: 1px solid #d9d9d9;
    color: #b7b7b7;
    cursor: default;
  }
}
</style>