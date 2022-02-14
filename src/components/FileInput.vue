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

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'file-input',
  emits: ['change'],
  props: {
    accept: {
      type: String,
      default: 'image/*',
    },
  },
  setup(props, { emit }) {
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

    return {
      handleClick,
      handleChange,
      inputRef,
    }
  },
})
</script>

<style lang="scss" scoped>
.input {
  display: none;
}
</style>