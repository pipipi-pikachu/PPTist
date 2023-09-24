<template>
  <div class="base-view" :class="{ 'laser-pen': laserPen }">
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

    <SlideThumbnails 
      v-if="slideThumbnailModelVisible" 
      :turnSlideToIndex="turnSlideToIndex" 
      @close="slideThumbnailModelVisible = false"
    />

    <WritingBoardTool 
      :slideWidth="slideWidth"
      :slideHeight="slideHeight"
      v-if="writingBoardToolVisible" 
      @close="writingBoardToolVisible = false" 
    />

    <CountdownTimer 
      v-if="timerlVisible" 
      @close="timerlVisible = false" 
    />

    <div class="tools-left">
      <IconLeftTwo class="tool-btn" theme="two-tone" :fill="['#111', '#fff']" @click="execPrev()" />
      <IconRightTwo class="tool-btn" theme="two-tone" :fill="['#111', '#fff']" @click="execNext()" />
    </div>

    <div 
      class="tools-right" :class="{ 'visible': rightToolsVisible }" 
      @mouseleave="rightToolsVisible = false"
      @mouseenter="rightToolsVisible = true"
    >
      <div class="content">
        <div class="tool-btn page-number" @click="slideThumbnailModelVisible = true">幻灯片 {{slideIndex + 1}} / {{slides.length}}</div>
        <IconWrite class="tool-btn" v-tooltip="'画笔工具'" @click="writingBoardToolVisible = true" />
        <IconMagic class="tool-btn" v-tooltip="'激光笔'" :class="{ 'active': laserPen }" @click="laserPen = !laserPen" />
        <IconStopwatchStart class="tool-btn" v-tooltip="'计时器'" :class="{ 'active': timerlVisible }" @click="timerlVisible = !timerlVisible" />
        <IconListView class="tool-btn" v-tooltip="'演讲者视图'" @click="changeViewMode('presenter')" />
        <IconOffScreenOne class="tool-btn" v-tooltip="'退出全屏'" v-if="fullscreenState" @click="manualExitFullscreen()" />
        <IconFullScreenOne class="tool-btn" v-tooltip="'进入全屏'" v-else @click="enterFullscreen()" />
        <IconPower class="tool-btn" v-tooltip="'结束放映'" @click="exitScreening()" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { ContextmenuItem } from '@/components/Contextmenu/types'
import { enterFullscreen } from '@/utils/fullscreen'
import useScreening from '@/hooks/useScreening'
import useExecPlay from './hooks/useExecPlay'
import useSlideSize from './hooks/useSlideSize'
import useFullscreen from './hooks/useFullscreen'

import ScreenSlideList from './ScreenSlideList.vue'
import SlideThumbnails from './SlideThumbnails.vue'
import WritingBoardTool from './WritingBoardTool.vue'
import CountdownTimer from './CountdownTimer.vue'

const props = defineProps<{
  changeViewMode: (mode: 'base' | 'presenter') => void
}>()

const { slides, slideIndex } = storeToRefs(useSlidesStore())

const {
  autoPlayTimer,
  autoPlay,
  closeAutoPlay,
  autoPlayInterval,
  setAutoPlayInterval,
  loopPlay,
  setLoopPlay,
  mousewheelListener,
  touchStartListener,
  touchEndListener,
  turnPrevSlide,
  turnNextSlide,
  turnSlideToIndex,
  turnSlideToId,
  execPrev,
  execNext,
  animationIndex,
} = useExecPlay()

const { slideWidth, slideHeight } = useSlideSize()
const { exitScreening } = useScreening()
const { fullscreenState, manualExitFullscreen } = useFullscreen()

const rightToolsVisible = ref(false)
const writingBoardToolVisible = ref(false)
const timerlVisible = ref(false)
const slideThumbnailModelVisible = ref(false)
const laserPen = ref(false)

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
      text: autoPlayTimer.value ? '取消自动放映' : '自动放映',
      handler: autoPlayTimer.value ? closeAutoPlay : autoPlay,
      children: [
        {
          text: '2.5秒',
          subText: autoPlayInterval.value === 2500 ? '√' : '',
          handler: () => setAutoPlayInterval(2500),
        },
        {
          text: '5秒',
          subText: autoPlayInterval.value === 5000 ? '√' : '',
          handler: () => setAutoPlayInterval(5000),
        },
        {
          text: '7.5秒',
          subText: autoPlayInterval.value === 7500 ? '√' : '',
          handler: () => setAutoPlayInterval(7500),
        },
        {
          text: '10秒',
          subText: autoPlayInterval.value === 10000 ? '√' : '',
          handler: () => setAutoPlayInterval(10000),
        },
      ],
    },
    {
      text: '循环放映',
      subText: loopPlay.value ? '√' : '',
      handler: () => setLoopPlay(!loopPlay.value),
    },
    { divider: true },
    {
      text: '显示工具栏',
      handler: () => rightToolsVisible.value = true,
    },
    {
      text: '查看所有幻灯片',
      handler: () => slideThumbnailModelVisible.value = true,
    },
    {
      text: '画笔工具',
      handler: () => writingBoardToolVisible.value = true,
    },
    {
      text: '演讲者视图',
      handler: () => props.changeViewMode('presenter'),
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
.base-view {
  width: 100%;
  height: 100%;

  &.laser-pen {
    cursor: url(data:image/png;base64,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) 20 20, default !important;
  }
}
.tools-left {
  position: fixed;
  bottom: 8px;
  left: 8px;
  font-size: 25px;
  color: #666;
  z-index: 10;

  .tool-btn {
    opacity: .35;
    cursor: pointer;

    &:hover {
      opacity: .9;
    }
    & + .tool-btn {
      margin-left: 8px;
    }
  }
}
.tools-right {
  height: 66px;
  position: fixed;
  bottom: -66px;
  right: 0;
  z-index: 5;
  padding: 8px;
  transition: bottom $transitionDelay;

  &.visible {
    bottom: 0;
  }

  &::after {
    content: '';
    width: 100%;
    height: 66px;
    position: absolute;
    left: 0;
    top: -66px;
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $borderRadius;
    font-size: 25px;
    background-color: #fff;
    color: $textColor;
    padding: 8px 10px;
    box-shadow: 0 2px 12px 0 rgb(56, 56, 56, .2);
    border: 1px solid #e2e6ed;
  }

  .tool-btn {
    cursor: pointer;

    &:hover, &.active {
      color: $themeColor;
    }

    & + .tool-btn {
      margin-left: 15px;
    }
  }
  .page-number {
    font-size: 13px;
    padding: 8px 12px;
    cursor: pointer;
  }
}
</style>