<template>
  <ButtonGroup class="radio-group">
    <slot></slot>
  </ButtonGroup>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import { injectKeyRadioGroupValue } from '@/types/injectKey'

import ButtonGroup from './ButtonGroup.vue'

const props = withDefaults(defineProps<{
  value: string
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  (event: 'update:value', payload: string): void
}>()

const updateValue = (value: string) => {
  if (props.disabled) return
  emit('update:value', value)
}

const value = computed(() => props.value)

provide(injectKeyRadioGroupValue, {
  value,
  updateValue,
})
</script>