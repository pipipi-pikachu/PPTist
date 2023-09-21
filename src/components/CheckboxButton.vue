<template>
  <Button 
    :checked="checked"
    :disabled="disabled"
    type="checkbox"
  >
    <slot></slot>
  </Button>
</template>

<script lang="ts" setup>
import Button from './Button.vue'

withDefaults(defineProps<{
  checked?: boolean
  disabled?: boolean
}>(), {
  checked: false,
  disabled: false,
})
</script>