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
      'small': size === 'small',
      'first': first,
      'last': last,
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
  size?: 'small' | 'normal'
  first?: boolean
  last?: boolean
}>(), {
  checked: false,
  disabled: false,
  type: 'default',
  size: 'normal',
  first: false,
  last: false,
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
  min-height: 32px;
  height: auto;
  line-height: 1.4;
  overflow-wrap: anywhere;
  outline: 0;
  font-size: 13px;
  padding: 6px 15px;
  text-align: center;
  color: $textColor;
  border-radius: $borderRadius;
  user-select: none;
  letter-spacing: 1px;
  cursor: pointer;

  &.small {
    min-height: 24px;
    padding: 3px 7px;
    letter-spacing: 0;
    font-size: 12px;
  }

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
      background-color: $themeHoverColor;
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