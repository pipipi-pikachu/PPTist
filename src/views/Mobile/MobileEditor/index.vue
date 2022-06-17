<template>
  <div class="mobile-editor">
    <Header :changeMode="changeMode" />
    
    <div class="content" ref="contentRef" @touchstart="handleClickBlankArea()">
      <div class="viewport-wrapper" :style="viewportStyles">
        <div class="background" :style="backgroundStyle"></div>
        <AlignmentLine 
          v-for="(line, index) in alignmentLines" 
          :key="index" 
          :type="line.type" 
          :axis="line.axis" 
          :length="line.length"
          :canvasScale="canvasScale"
        />
        <template v-for="element in elementList" :key="element.id">
          <MobileOperate
            v-if="element.type !== 'line'"
            :elementInfo="element"
            :isSelected="activeElementIdList.includes(element.id)"
            :canvasScale="canvasScale"
            :scaleElement="scaleElement"
          />
        </template>
        <div class="viewport" :style="{ transform: `scale(${canvasScale})` }">
          <MobileEditableElement 
            v-for="(element, index) in elementList" 
            :key="element.id"
            :elementInfo="element"
            :elementIndex="index + 1"
            :selectElement="selectElement"
          />
        </div>
      </div>
    </div>

    <SlideToolbar />
    <ElementToolbar v-if="handleElement" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTElement } from '@/types/slides'
import { AlignmentLineProps } from '@/types/edit'
import { Mode } from '@/types/mobile'
import { VIEWPORT_SIZE } from '@/configs/canvas'
import useSlideBackgroundStyle from '@/hooks/useSlideBackgroundStyle'
import useDragElement from '@/views/Editor/Canvas/hooks/useDragElement'
import useScaleElement from '@/views/Editor/Canvas/hooks/useScaleElement'

import AlignmentLine from '@/views/Editor/Canvas/AlignmentLine.vue'
import MobileEditableElement from './MobileEditableElement.vue'
import MobileOperate from './MobileOperate.vue'
import SlideToolbar from './SlideToolbar.vue'
import ElementToolbar from './ElementToolbar.vue'
import Header from './Header.vue'

defineProps({
  changeMode: {
    type: Function as PropType<(mode: Mode) => void>,
    required: true,
  },
})

const slidesStore = useSlidesStore()
const mainStore = useMainStore()
const { slideIndex, currentSlide, viewportRatio } = storeToRefs(slidesStore)
const { activeElementIdList, handleElement } = storeToRefs(mainStore)

const contentRef = ref<HTMLElement>()

const alignmentLines = ref<AlignmentLineProps[]>([])

const background = computed(() => currentSlide.value.background)
const { backgroundStyle } = useSlideBackgroundStyle(background)

const canvasScale = computed(() => {
  if (!contentRef.value) return 1
  const contentWidth = contentRef.value.clientWidth
  const contentheight = contentRef.value.clientHeight

  const contentRatio = contentheight / contentWidth
  if (contentRatio >= viewportRatio.value) return (contentWidth - 20) / VIEWPORT_SIZE
  return (contentheight - 20) / viewportRatio.value / VIEWPORT_SIZE
})

onMounted(() => {
  if (activeElementIdList.value.length) mainStore.setActiveElementIdList([])
  if (slideIndex.value !== 0) slidesStore.updateSlideIndex(0)
})

const viewportStyles = computed(() => ({
  width: VIEWPORT_SIZE * canvasScale.value + 'px',
  height: VIEWPORT_SIZE * viewportRatio.value * canvasScale.value + 'px',
}))

const elementList = ref<PPTElement[]>([])
const setLocalElementList = () => {
  elementList.value = currentSlide.value ? JSON.parse(JSON.stringify(currentSlide.value.elements)) : []
}
watchEffect(setLocalElementList)

const { dragElement } = useDragElement(elementList, alignmentLines, canvasScale)
const { scaleElement } = useScaleElement(elementList, alignmentLines, canvasScale)

const selectElement = (e: TouchEvent, element: PPTElement, startMove = true) => {
  if (!activeElementIdList.value.includes(element.id)) {
    mainStore.setActiveElementIdList([element.id])
    mainStore.setHandleElementId(element.id)
  }
  if (startMove) dragElement(e, element)
}

const handleClickBlankArea = () => {
  mainStore.setActiveElementIdList([])
}
</script>

<style lang="scss" scoped>
.mobile-editor {
  height: 100%;
  position: relative;
  background-color: $lightGray;
}
.content {
  height: calc(100% - 280px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.viewport {
  transform-origin: 0 0;
}
.viewport-wrapper {
  position: relative;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
}
.background {
  width: 100%;
  height: 100%;
  background-position: center;
  position: absolute;
}
</style>