<template>
  <textarea
    class="textarea" 
    :class="{
      'disabled': disabled,
      'resizable': resizable,
    }"
    :disabled="disabled"
    :value="value" 
    :rows="rows"
    :placeholder="placeholder"
    @input="$event => handleInput($event)"
  ></textarea>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  value: string
  rows?: number
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
}>()

const handleInput = (e: Event) => {
  emit('update:value', (e.target as HTMLInputElement).value)
}
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