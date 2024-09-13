<template>
  <label 
    class="checkbox"
    :class="{
      'checked': value,
      'disabled': disabled,
    }"
    @change="$event => handleChange($event)"
  >
    <span class="checkbox-input"></span>
    <input class="checkbox-original" type="checkbox" :checked="value">
    <span class="checkbox-label">
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  value: boolean
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  (event: 'update:value', payload: boolean): void
}>()

const handleChange = (e: Event) => {
  if (props.disabled) return
  emit('update:value', (e.target as HTMLInputElement).checked)
}
</script>

<style lang="scss" scoped>
.checkbox {
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:not(.disabled).checked {
    .checkbox-input {
      background-color: $themeColor;
      border-color: $themeColor;
    }
    .checkbox-input::after {
      transform: rotate(45deg) scaleY(1);
    }

    .checkbox-label {
      color: $themeColor;
    }
  }

  &.disabled {
    color: #b7b7b7;
    cursor: default;

    .checkbox-input {
      background-color: #f5f5f5;
    }
  }
}

.checkbox-input {
  display: inline-block;
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: $borderRadius;
  width: 16px;
  height: 16px;
  background-color: #fff;
  vertical-align: middle;
  transition: border-color .15s cubic-bezier(.71, -.46, .29, 1.46), background-color .15s cubic-bezier(.71, -.46, .29, 1.46);
  z-index: 1;

  &::after {
    content: '';
    border: 2px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 9px;
    left: 4px;
    position: absolute;
    top: 1px;
    transform: rotate(45deg) scaleY(0);
    width: 6px;
    transition: transform .15s ease-in .05s;
    transform-origin: center;
  }
}
.checkbox-original {
  opacity: 0;
  outline: 0;
  position: absolute;
  margin: 0;
  width: 0;
  height: 0;
  z-index: -1;
}
.checkbox-label {
  margin-left: 5px;
  line-height: 20px;
  font-size: 13px;
  user-select: none;
}
</style>