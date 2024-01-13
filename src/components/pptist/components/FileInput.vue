<template>
  <div class="file-input" @click="handleClick()">
    <slot></slot>
    <input 
      class="input"
      type="file" 
      name="upload" 
      ref="inputRef" 
      :accept="accept" 
      @change="$event => handleChange($event)"
    >
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

withDefaults(defineProps<{
  accept?: string
}>(), {
  accept: 'image/*',
})

const emit = defineEmits<{
  (event: 'change', payload: FileList): void
}>()

const inputRef = ref<HTMLInputElement>()

const handleClick = () => {
  if (!inputRef.value) return
  inputRef.value.value = ''
  inputRef.value.click()
}
const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files) emit('change', files)
}
</script>

<style lang="scss" scoped>
.input {
  display: none;
}
</style>