<template>
  <div class="gradient-bar">
    <div class="bar" ref="barRef" :style="{ backgroundImage: gradientStyle }" @click="$event => addPoint($event)"></div>
    <div class="point" 
      :class="{ 'active': activeIndex === index }"
      v-for="(item, index) in points" 
      :key="item.pos + '-' + index" 
      :style="{
        backgroundColor: item.color,
        left: `calc(${item.pos}% - 5px)`,
      }"
      @mousedown.left="movePoint(index)"
      @click.right="removePoint(index)"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import type { GradientColor } from '@/types/slides'
import { ref, computed, watchEffect, watch } from 'vue'

const props = defineProps<{
  value: GradientColor[]
}>()

const emit = defineEmits<{
  (event: 'update:value', payload: GradientColor[]): void
  (event: 'update:index', payload: number): void
}>()

const points = ref<GradientColor[]>([])

const barRef = ref<HTMLElement>()
const activeIndex = ref(0)

watchEffect(() => {
  points.value = props.value
  if (activeIndex.value > props.value.length - 1) activeIndex.value = 0
})

watch(activeIndex, () => {
  emit('update:index', activeIndex.value)
})

const gradientStyle = computed(() => {
  const list = points.value.map(item => `${item.color} ${item.pos}%`)
  return `linear-gradient(to right, ${list.join(',')})`
})

const removePoint = (index: number) => {
  if (props.value.length <= 2) return

  if (index === activeIndex.value) {
    activeIndex.value = (index - 1 < 0) ? 0 : index - 1
  }
  else if (activeIndex.value === props.value.length - 1) {
    activeIndex.value = props.value.length - 2
  }

  const values = props.value.filter((item, _index) => _index !== index)
  emit('update:value', values)
}

const movePoint = (index: number) => {
  let isMouseDown = true

  document.onmousemove = e => {
    if (!isMouseDown) return
    if (!barRef.value) return

    let pos = Math.round((e.clientX - barRef.value.getBoundingClientRect().left) / barRef.value.clientWidth * 100)
    if (pos > 100) pos = 100
    if (pos < 0) pos = 0

    points.value = points.value.map((item, _index) => {
      if (_index === index) return { ...item, pos }
      return item
    })
  }
  document.onmouseup = () => {
    isMouseDown = false

    const point = points.value[index]
    const _points = [...points.value]
    _points.splice(index, 1)

    let targetIndex = 0
    for (let i = 0; i < _points.length; i++) {
      if (point.pos > _points[i].pos) targetIndex = i + 1
    }

    activeIndex.value = targetIndex
    _points.splice(targetIndex, 0, point)

    emit('update:value', _points)
    
    document.onmousemove = null
    document.onmouseup = null
  }
}

const addPoint = (e: MouseEvent) => {
  if (props.value.length >= 6) return
  if (!barRef.value) return
  const pos = Math.round((e.clientX - barRef.value.getBoundingClientRect().left) / barRef.value.clientWidth * 100)

  let targetIndex = 0
  for (let i = 0; i < props.value.length; i++) {
    if (pos > props.value[i].pos) targetIndex = i + 1
  }
  const color = props.value[targetIndex - 1] ? props.value[targetIndex - 1].color : props.value[targetIndex].color
  const values = [...props.value]
  values.splice(targetIndex, 0, { pos, color })
  activeIndex.value = targetIndex
  emit('update:value', values)
}
</script>

<style lang="scss" scoped>
.gradient-bar {
  width: calc(100% - 10px);
  height: 18px;
  padding: 1px 0;
  margin: 3px 0;
  position: relative;
  left: 5px;

  .bar {
    height: 16px;
    border: 1px solid #d9d9d9;
  }
  .point {
    width: 10px;
    height: 18px;
    background-color: #fff;
    position: absolute;
    top: 0;
    border: 2px solid #fff;
    outline: 1px solid #d9d9d9;
    box-shadow: 0 0 2px 2px #d9d9d9;
    border-radius: 1px;
    cursor: pointer;

    &.active {
      outline: 1px solid $themeColor;
      box-shadow: 0 0 2px 2px $themeColor;
    }
  }
}
</style>