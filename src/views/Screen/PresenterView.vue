<template>
  <div class="presenter-view">
    <div class="toolbar">
      <div class="tool-btn" @click="changeViewMode('base')"><IconListView class="tool-icon" /><span>普通视图</span></div>
      <div class="tool-btn" @click="writingBoardToolVisible = !writingBoardToolVisible"><IconWrite class="tool-icon" /><span>画笔</span></div>
      <div class="tool-btn" @click="() => fullscreenState ? manualExitFullscreen() : enterFullscreen()">
        <IconOffScreenOne class="tool-icon" v-if="fullscreenState" />
        <IconOffScreenOne class="tool-icon" v-else />
        <span>{{ fullscreenState ? '退出全屏' : '全屏' }}</span>
      </div>
      <Divider class="divider" />
      <div class="tool-btn" @click="exitScreening()"><IconPower class="tool-icon" /><span>结束放映</span></div>
    </div>

    <div class="content">
      <div class="slide-list-wrap" ref="slideListWrapRef">
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
        <WritingBoardTool 
          :slideWidth="slideWidth"
          :slideHeight="slideHeight"
          :position="{
            left: '75px',
            top: '5px',
          }"
          v-if="writingBoardToolVisible" 
          @close="writingBoardToolVisible = false" 
        />
      </div>
      <div class="thumbnails"
        ref="thumbnailsRef"
        @mousewheel.prevent="$event => handleMousewheelThumbnails($event)"
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
      <div class="remark-content" :style="{ fontSize: remarkFontSize + 'px' }" v-html="currentSlideRemark"></div>
      <div class="remark-scale">
        <div :class="['scale-btn', { 'disable': remarkFontSize === 12 }]" @click="setRemarkFontSize(remarkFontSize - 2)"><IconMinus /></div>
        <div :class="['scale-btn', { 'disable': remarkFontSize === 40 }]" @click="setRemarkFontSize(remarkFontSize + 2)"><IconPlus /></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch, PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { ContextmenuItem } from '@/components/Contextmenu/types'
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

export default defineComponent({
  name: 'presenter-view',
  components: {
    ScreenSlideList,
    ThumbnailSlide,
    WritingBoardTool,
  },
  props: {
    changeViewMode: {
      type: Function as PropType<(mode: 'base' | 'presenter') => void>,
      required: true,
    },
  },
  setup(props) {
    const { slides, slideIndex, viewportRatio, currentSlide } = storeToRefs(useSlidesStore())

    const slideListWrapRef = ref<HTMLElement>()
    const thumbnailsRef = ref<HTMLElement>()
    const writingBoardToolVisible = ref(false)

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

    return {
      slides,
      slideIndex,
      viewportRatio,
      remarkFontSize,
      currentSlideRemark,
      setRemarkFontSize,
      slideListWrapRef,
      thumbnailsRef,
      slideWidth,
      slideHeight,
      animationIndex,
      turnSlideToId,
      mousewheelListener,
      touchStartListener,
      touchEndListener,
      turnSlideToIndex,
      contextmenus,
      slidesLoadLimit,
      handleMousewheelThumbnails,
      exitScreening,
      fullscreenState,
      enterFullscreen,
      manualExitFullscreen,
      writingBoardToolVisible,
    }
  },
})
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

    &:hover {
      color: $themeColor;
    }
  }

  .divider {
    width: 70%;
    min-width: 70%;
    margin: 24px 15%;
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