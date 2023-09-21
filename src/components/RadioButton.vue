<template>
  <Button 
    :checked="!disabled && _value === value"
    :disabled="disabled"
    type="radio"
    @click="!disabled && updateValue(value)"
  >
    <slot></slot>
  </Button>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { injectKeyRadioGroupValue, type RadioGroupValue } from '@/types/injectKey'

import Button from './Button.vue'

const { value: _value, updateValue } = inject(injectKeyRadioGroupValue) as RadioGroupValue

withDefaults(defineProps<{
  value: string
  disabled?: boolean
}>(), {
  disabled: false,
})
</script>