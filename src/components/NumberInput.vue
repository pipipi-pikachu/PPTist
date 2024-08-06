<template>
  <div 
    class="number-input"
    :class="{
      'disabled': disabled,
      'focused': focused,
    }"
  >
    <span class="prefix">
      <slot name="prefix"></slot>
    </span>
    <div class="input-wrap">
      <input
        type="text"
        :disabled="disabled"
        v-model="number" 
        :placeholder="placeholder"
        @input="$event => emit('input', $event)"
        @focus="$event => handleFocus($event)"
        @blur="$event => handleBlur($event)"
        @change="$event => emit('change', $event)"
        @keydown.enter="$event => handleEnter($event)"
      />
      <div class="handlers">
        <span class="handler" @click="number += step">
          <svg fill="currentColor" width="1em" height="1em" viewBox="64 64 896 896"><path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 00140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z"></path></svg>
        </span>
        <span class="handler" @click="number -= step">
          <svg fill="currentColor" width="1em" height="1em" viewBox="64 64 896 896"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path></svg>
        </span>
      </div>
    </div>
    <span class="suffix">
      <slot name="suffix"></slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  disabled?: boolean
  placeholder?: string
  min?: number
  max?: number
  step?: number
}>(), {
  disabled: false,
  placeholder: '',
  min: 0,
  max: Infinity,
  step: 1,
})

const emit = defineEmits<{
  (event: 'update:value', payload: number): void
  (event: 'input', payload: Event): void
  (event: 'change', payload: Event): void
  (event: 'blur', payload: Event): void
  (event: 'focus', payload: Event): void
  (event: 'enter', payload: Event): void
}>()

const number = ref(0)
const focused = ref(false)

watch(() => props.value, () => {
  if (props.value !== number.value) {
    number.value = props.value
  }
}, {
  immediate: true,
})

watch(number, () => {
  const value = +number.value
  if (isNaN(value)) return
  else if (value > props.max) return
  else if (value < props.min) return

  number.value = value
  emit('update:value', number.value)
})

const checkAndEmitValue = () => {
  let value = +number.value
  if (isNaN(value)) value = props.min
  else if (value > props.max) value = props.max
  else if (value < props.min) value = props.min

  number.value = value
  emit('update:value', number.value)
}

const handleEnter = (e: Event) => {
  checkAndEmitValue()
  emit('enter', e)
}

const handleBlur = (e: Event) => {
  checkAndEmitValue()
  focused.value = false
  emit('blur', e)
}
const handleFocus = (e: Event) => {
  focused.value = true
  emit('focus', e)
}
</script>

<style lang="scss" scoped>
.number-input {
  background-color: #fff;
  border: 1px solid #d9d9d9;
  padding: 0 0 0 5px;
  border-radius: $borderRadius;
  transition: border-color .25s;
  font-size: 13px;
  display: inline-flex;

  .input-wrap {
    flex: 1;
    color: $textColor;
    padding: 0 0 0 5px;
    position: relative;
  }
  &:not(.disabled) .input-wrap:hover .handlers {
    opacity: 1;
  }
  .handlers {
    width: 20px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    font-size: 6px;
    color: #999;
    opacity: 0;
    user-select: none;
    transition: opacity .25s;

    .handler {
      width: 100%;
      height: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #d9d9d9;
      cursor: pointer;

      & + .handler {
        border-top: 1px solid #d9d9d9;
      }

      &:hover {
        color: $themeColor;
      }
    }
  }
  input {
    width: 100%;
    min-width: 0;
    padding: 0;
    height: 30px;
    line-height: 30px;
    outline: 0;
    border: 0;
    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';

    &::placeholder {
      color: #bfbfbf;
    }
  }

  &:not(.disabled):hover, &.focused {
    border-color: $themeColor;
  }

  &.disabled {
    background-color: #f5f5f5;
    border-color: #dcdcdc;
    color: #b7b7b7;

    input {
      color: #b7b7b7;
    }
  }

  .prefix, .suffix {
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 30px;
    user-select: none;
  }
}
</style>