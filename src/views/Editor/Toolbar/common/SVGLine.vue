<template>
  <svg width="100%" height="100%" viewBox="0 0 100 10">
    <defs>
      <LinePointMarker
        v-if="markers && markers[0]"
        :id="id"
        position="start"
        :type="markers[0]"
        :color="color"
        :baseSize="width"
      />
      <LinePointMarker
        v-if="markers && markers[1]"
        :id="id"
        position="end"
        :type="markers[1]"
        :color="color"
        :baseSize="width"
      />
    </defs>

    <line 
      :x1="padding" 
      :y1="5" 
      :x2="100 - padding" 
      :y2="5" 
      :stroke="color" 
      :stroke-width="width" 
      :stroke-dasharray="lineDashArray" 
      :marker-start="markers && markers[0] ? `url(#${id}-${markers[0]}-start)` : ''"
      :marker-end="markers && markers[1] ? `url(#${id}-${markers[1]}-end)` : ''"
    />
  </svg>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { nanoid } from 'nanoid'
import type { LinePoint, LineStyleType } from '@/types/slides'
import LinePointMarker from '@/views/components/element/LineElement/LinePointMarker.vue'

const props = withDefaults(defineProps<{
  width?: number
  color?: string
  markers?: [LinePoint, LinePoint]
  type?: LineStyleType
  padding?: number
}>(), {
  width: 2,
  color: '#333',
  padding: 0
})

const id = ref('')
onMounted(() => {
  id.value = nanoid()
})

const lineDashArray = computed(() => {
  const size = props.width
  if (props.type === 'dashed') return size <= 8 ? `${size * 5} ${size * 2.5}` : `${size * 5} ${size * 1.5}`
  if (props.type === 'dotted') return size <= 8 ? `${size * 1.8} ${size * 1.6}` : `${size * 1.5} ${size * 1.2}`
  return '0 0'
})
</script>

<style lang="scss" scoped>

</style>