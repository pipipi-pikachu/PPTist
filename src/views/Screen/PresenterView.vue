<template>
  <div class="presenter-view">
    <div class="toolbar">
      <div class="tool-btn" @click="changeViewMode('base')"><IconListView class="tool-icon" /><span>普通视图</span></div>
      <div class="tool-btn" :class="{ 'active': writingBoardToolVisible }" @click="writingBoardToolVisible = !writingBoardToolVisible"><IconWrite class="tool-icon" /><span>画笔</span></div>
      <div class="tool-btn" :class="{ 'active': laserPen }" @click="laserPen = !laserPen"><IconMagic class="tool-icon" /><span>激光笔</span></div>
      <div class="tool-btn" :class="{ 'active': timerlVisible }" @click="timerlVisible = !timerlVisible"><IconStopwatchStart class="tool-icon" /><span>计时器</span></div>
      <div class="tool-btn" @click="() => fullscreenState ? manualExitFullscreen() : enterFullscreen()">
        <IconOffScreenOne class="tool-icon" v-if="fullscreenState" />
        <IconOffScreenOne class="tool-icon" v-else />
        <span>{{ fullscreenState ? '退出全屏' : '全屏' }}</span>
      </div>
      <Divider class="divider" />
      <div class="tool-btn" @click="exitScreening()"><IconPower class="tool-icon" /><span>结束放映</span></div>
    </div>

    <div class="content">
      <div 
        class="slide-list-wrap" 
        :class="{ 'laser-pen': laserPen }" 
        ref="slideListWrapRef"
      >
        <ScreenSlideList
          :slideWidth="slideWidth"
          :slideHeight="slideHeight"
          :animationIndex="animationIndex"
          :turnSlideToId="turnSlideToId"
          :manualExitFullscreen="manualExitFullscreen"
          @wheel="$event => mousewheelListener($event)"
          @touchstart="$event => touchStartListener($event)"
          @touchend="$event => touchEndListener($event)"
          v-contextmenu="contextmenus"
        />
        <WritingBoardTool 
          :slideWidth="slideWidth"
          :slideHeight="slideHeight"
          :left="-365"
          :top="-155"
          v-if="writingBoardToolVisible" 
          @close="writingBoardToolVisible = false" 
        />

        <CountdownTimer 
          v-if="timerlVisible" 
          :left="75" 
          @close="timerlVisible = false" 
        />
      </div>
      <div class="thumbnails"
        ref="thumbnailsRef"
        @wheel.prevent="$event => handleMousewheelThumbnails($event)"
      >
        <div 
          class="thumbnail"
          :class="{ 'active': index === slideIndex }"
          v-for="(slide, index) in slides" 
          :key="slide.id"
          @click="turnSlideToIndex(index)"
        >
          <ThumbnailSlide :slide="slide" :size="120 / viewportRatio" :visible="index < slidesLoadLimit" />
        </div>
      </div>
    </div>

    <div class="remark">
      <div class="header">
        <span>演讲者备注</span>
        <span>P {{slideIndex + 1}} / {{slides.length}}</span>
      </div>
      <div class="remark-content ProseMirror-static" :style="{ fontSize: remarkFontSize + 'px' }" v-html="currentSlideRemark"></div>
      <div class="remark-scale">
        <div :class="['scale-btn', { 'disable': remarkFontSize === 12 }]" @click="setRemarkFontSize(remarkFontSize - 2)"><IconMinus /></div>
        <div :class="['scale-btn', { 'disable': remarkFontSize === 40 }]" @click="setRemarkFontSize(remarkFontSize + 2)"><IconPlus /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { ContextmenuItem } from '@/components/Contextmenu/types'
import { enterFullscreen } from '@/utils/fullscreen'
import { parseText2Paragraphs } from '@/utils/textParser'
import useScreening from '@/hooks/useScreening'
import useLoadSlides from '@/hooks/useLoadSlides'
import useExecPlay from './hooks/useExecPlay'
import useSlideSize from './hooks/useSlideSize'
import useFullscreen from './hooks/useFullscreen'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import ScreenSlideList from './ScreenSlideList.vue'
import WritingBoardTool from './WritingBoardTool.vue'
import CountdownTimer from './CountdownTimer.vue'
import Divider from '@/components/Divider.vue'

const props = defineProps<{
  changeViewMode: (mode: 'base' | 'presenter') => void
}>()

const { slides, slideIndex, viewportRatio, currentSlide } = storeToRefs(useSlidesStore())

const slideListWrapRef = ref<HTMLElement>()
const thumbnailsRef = ref<HTMLElement>()
const writingBoardToolVisible = ref(false)
const timerlVisible = ref(false)
const laserPen = ref(false)

const {
  mousewheelListener,
  touchStartListener,
  touchEndListener,
  turnPrevSlide,
  turnNextSlide,
  turnSlideToIndex,
  turnSlideToId,
  animationIndex,
} = useExecPlay()

const { slideWidth, slideHeight } = useSlideSize(slideListWrapRef)
const { exitScreening } = useScreening()
const { slidesLoadLimit } = useLoadSlides()
const { fullscreenState, manualExitFullscreen } = useFullscreen()

const remarkFontSize = ref(16)
const currentSlideRemark = computed(() => {
  return parseText2Paragraphs(currentSlide.value.remark || '无备注')
})

const handleMousewheelThumbnails = (e: WheelEvent) => {
  if (!thumbnailsRef.value) return
  thumbnailsRef.value.scrollBy(e.deltaY, 0)
}

const setRemarkFontSize = (fontSize: number) => {
  if (fontSize < 12 || fontSize > 40) return
  remarkFontSize.value = fontSize
}

watch(slideIndex, () => {
  nextTick(() => {
    if (!thumbnailsRef.value) return

    const activeThumbnailRef: HTMLElement | null = thumbnailsRef.value.querySelector('.thumbnail.active')
    if (!activeThumbnailRef) return

    const width = thumbnailsRef.value.offsetWidth
    const offsetLeft = activeThumbnailRef.offsetLeft
    thumbnailsRef.value.scrollTo({ left: offsetLeft - width / 2, behavior: 'smooth' })
  })
})

const contextmenus = (): ContextmenuItem[] => {
  return [
    {
      text: '上一页',
      subText: '↑ ←',
      disable: slideIndex.value <= 0,
      handler: () => turnPrevSlide(),
    },
    {
      text: '下一页',
      subText: '↓ →',
      disable: slideIndex.value >= slides.value.length - 1,
      handler: () => turnNextSlide(),
    },
    {
      text: '第一页',
      disable: slideIndex.value === 0,
      handler: () => turnSlideToIndex(0),
    },
    {
      text: '最后一页',
      disable: slideIndex.value === slides.value.length - 1,
      handler: () => turnSlideToIndex(slides.value.length - 1),
    },
    { divider: true },
    {
      text: '画笔工具',
      handler: () => writingBoardToolVisible.value = true,
    },
    {
      text: '普通视图',
      handler: () => props.changeViewMode('base'),
    },
    { divider: true },
    {
      text: '结束放映',
      subText: 'ESC',
      handler: exitScreening,
    },
  ]
}
</script>

<style lang="scss" scoped>
.presenter-view {
  width: 100%;
  height: 100%;
  display: flex;
}
.toolbar {
  width: 70px;
  height: 100%;
  background-color: #fff;
  border-right: solid 1px #eee;
  font-size: 12px;
  margin: 20px 0;

  .tool-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    & + .tool-btn {
      margin-top: 22px;
    }

    &:hover, &.active {
      color: $themeColor;
    }
  }

  .divider {
    width: 70%;
    margin: 24px 15% !important;
  }

  .tool-icon {
    margin-bottom: 8px;
    font-size: 22px;
  }
}
.content {
  width: calc(100% - 430px);
  height: 100%;
  background-color: #1d1d1d;
}
.slide-list-wrap {
  height: calc(100% - 190px);
  margin: 20px;
  overflow: hidden;
  position: relative;

  &.laser-pen {
    cursor: url(data:image/png;base64,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) 20 20, default !important;
  }
}
.thumbnails {
  height: 150px;
  padding: 15px;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  border-top: solid 1px #3a3a3a;
}
.thumbnail {
  display: inline-block;
  outline: 2px solid #aaa;

  & + .thumbnail {
    margin-left: 10px;
  }

  &:hover {
    outline-color: $themeColor;
  }

  &.active {
    outline-width: 3px;
    outline-color: $themeColor;
  }
}
.remark {
  width: 360px;
  height: 100%;
  position: relative;
  background-color: #2a2a2a;
  border-left: solid 1px #3a3a3a;
  color: #fff;

  .header {
    height: 60px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    border-bottom: 1px solid #3a3a3a;
  }

  .remark-content {
    height: calc(100% - 60px);
    padding: 20px;
    line-height: 1.5;
    @include overflow-overlay();
  }

  .remark-scale {
    position: absolute;
    right: 5px;
    bottom: 5px;
    font-size: 22px;
    display: flex;
  }
  .scale-btn {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: pointer;

    &.disable {
      color: #666;
      cursor: no-drop;
    }

    &:not(.disable):hover {
      background-color: #333;
    }
  }
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>