<template>
  <textarea
    class="textarea" 
    :class="{
      'disabled': disabled,
      'resizable': resizable,
    }"
    ref="textareaRef"
    :disabled="disabled"
    :value="value" 
    :rows="rows"
    :placeholder="placeholder"
    :style="{
      padding: padding ? `${padding}px` : '10px',
    }"
    @input="$event => handleInput($event)"
    @focus="$event => emit('focus', $event)"
    @blur="$event => emit('blur', $event)"
  ></textarea>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

withDefaults(defineProps<{
  value: string
  rows?: number
  padding?: number
  disabled?: boolean
  resizable?: boolean
  placeholder?: string
}>(), {
  rows: 4,
  disabled: false,
  resizable: false,
  placeholder: '',
})

const emit = defineEmits<{
  (event: 'update:value', payload: string): void
  (event: 'focus', payload: FocusEvent): void
  (event: 'blur', payload: FocusEvent): void
}>()

const handleInput = (e: Event) => {
  emit('update:value', (e.target as HTMLInputElement).value)
}

const textareaRef = ref<HTMLTextAreaElement>()
const focus = () => {
  if (textareaRef.value) textareaRef.value.focus()
}

defineExpose({
  focus,
})
</script>

<style lang="scss" scoped>
.textarea {
  outline: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: $borderRadius;
  padding: 10px;
  transition: border-color .25s;
  box-sizing: border-box;
  line-height: 1.675;
  resize: none;
  font-family: -apple-system,BlinkMacSystemFont, 'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';

  &:focus {
    border-color: $themeColor;
    background-color: #fff;
  }

  &.resizable {
    resize: vertical;
  }

  &.disabled {
    background-color: #f5f5f5;
    border-color: #dcdcdc;
    color: #b7b7b7;
  }

  &::placeholder {
    color: #bfbfbf;
  }
}
</style>