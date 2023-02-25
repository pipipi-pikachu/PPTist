<template>
  <div ref="containerRef" :class="$props.class">
    <slot 
      v-for="(item, index) in list" 
      :key="item[props.itemKey]" 
      :element="item" 
      :index="index" 
      name="item"
    ></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType, watch, onUnmounted } from 'vue'
import Sortable, { SortableOptions, SortableEvent } from 'sortablejs'
import type { AutoScrollOptions } from 'sortablejs/plugins'

type SortableOptionsProp = SortableOptions | AutoScrollOptions

const props = defineProps({
  options: {
    type: Object as PropType<SortableOptionsProp>,
    default: () => ({}),
  },
  list: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    type: Array as PropType<any[]>,
    required: true,
  },
  itemKey: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'start', payload: SortableEvent): void
  (event: 'end', payload: SortableEvent): void
  (event: 'add', payload: SortableEvent): void
  (event: 'remove', payload: SortableEvent): void
  (event: 'update', payload: SortableEvent): void
}>()

const isDragging = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const sortable = ref<Sortable | null>(null)

watch(containerRef, container => {
  if (container) {
    sortable.value = new Sortable(container, {
      ...props.options,
      onStart: event => {
        isDragging.value = true
        emit('start', event)
      },
      onEnd: event => {
        setTimeout(() => {
          isDragging.value = false
          emit('end', event)
        })
      },
      onAdd: event => emit('add', event),
      onRemove: event => emit('remove', event),
      onUpdate: event => emit('update', event),
    })
  }
})

watch(() => props.options, options => {
  if (options && sortable.value) {
    for (const key in options) {
      const name = key as keyof SortableOptionsProp
      const value = options[key as keyof SortableOptionsProp]
      sortable.value.option(name, value)
    }
  }
})

onUnmounted(() => {
  if (sortable.value) {
    sortable.value.destroy()
    containerRef.value = null
    sortable.value = null
  }
})
</script>