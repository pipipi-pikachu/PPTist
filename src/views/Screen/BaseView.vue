<template>
  <div class="base-view">
    <ScreenSlideList
      :slideWidth="slideWidth"
      :slideHeight="slideHeight"
      :animationIndex="animationIndex"
      :turnSlideToId="turnSlideToId"
      :manualExitFullscreen="manualExitFullscreen"
      @mousewheel="$event => mousewheelListener($event)"
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
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="画笔工具">
          <IconWrite class="tool-btn" @click="writingBoardToolVisible = true" />
        </Tooltip>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="演讲者视图">
          <IconListView class="tool-btn" @click="changeViewMode('presenter')" />
        </Tooltip>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" :title="fullscreenState ? '退出全屏' : '进入全屏'">
          <IconOffScreenOne class="tool-btn" v-if="fullscreenState" @click="manualExitFullscreen()" />
          <IconFullScreenOne class="tool-btn" v-else @click="enterFullscreen()" />
        </Tooltip>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="结束放映">
          <IconPower class="tool-btn" @click="exitScreening()" />
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { enterFullscreen } from '@/utils/fullscreen'
import useScreening from '@/hooks/useScreening'
import useExecPlay from './hooks/useExecPlay'
import useSlideSize from './hooks/useSlideSize'
import useFullscreen from './hooks/useFullscreen'

import ScreenSlideList from './ScreenSlideList.vue'
import SlideThumbnails from './SlideThumbnails.vue'
import WritingBoardTool from './WritingBoardTool.vue'

export default defineComponent({
  name: 'screen',
  components: {
    ScreenSlideList,
    SlideThumbnails,
    WritingBoardTool,
  },
  props: {
    changeViewMode: {
      type: Function as PropType<(mode: 'base' | 'presenter') => void>,
      required: true,
    },
  },
  setup(props) {
    const { slides, slideIndex } = storeToRefs(useSlidesStore())

    const {
      autoPlayTimer,
      autoPlay,
      closeAutoPlay,
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
    const slideThumbnailModelVisible = ref(false)


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
          text: autoPlayTimer.value ? '取消自动放映' : '自动放映',
          handler: autoPlayTimer.value ? closeAutoPlay : autoPlay,
        },
        {
          text: '结束放映',
          subText: 'ESC',
          handler: exitScreening,
        },
      ]
    }

    return {
      slides,
      slideIndex,
      slideWidth,
      slideHeight,
      mousewheelListener,
      touchStartListener,
      touchEndListener,
      animationIndex,
      contextmenus,
      execPrev,
      execNext,
      turnSlideToIndex,
      turnSlideToId,
      slideThumbnailModelVisible,
      writingBoardToolVisible,
      rightToolsVisible,
      fullscreenState,
      exitScreening,
      enterFullscreen,
      manualExitFullscreen,
    }
  },
})
</script>

<style lang="scss" scoped>
.base-view {
  width: 100%;
  height: 100%;
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
    box-shadow: 0 2px 12px 0 rgb(56 56 56 / 20%);
    border: 1px solid #e2e6ed;
  }

  .tool-btn {
    cursor: pointer;

    &:hover {
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