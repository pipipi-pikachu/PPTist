<template>
  <div class="pptist-screen">
    <div 
      class="slide-list"
      @mousewheel="$event => mousewheelListener($event)"
      @touchstart="$event => touchStartListener($event)"
      @touchend="$event => touchEndListener($event)"
      v-contextmenu="contextmenus"
    >
      <div 
        :class="[
          'slide-item', 
          `turning-mode-${slide.turningMode || 'slideY'}`,
          {
            'current': index === slideIndex,
            'before': index < slideIndex,
            'after': index > slideIndex,
            'hide': (index === slideIndex - 1 || index === slideIndex + 1) && slide.turningMode !== currentSlide.turningMode,
          }
        ]"
        v-for="(slide, index) in slides" 
        :key="slide.id"
      >
        <div 
          class="slide-content" 
          :style="{
            width: slideWidth + 'px',
            height: slideHeight + 'px',
          }"
          v-if="Math.abs(slideIndex - index) < 2"
        >
          <ScreenSlide 
            :slide="slide" 
            :scale="scale"
            :animationIndex="animationIndex"
            :turnSlideToId="turnSlideToId"
          />
        </div>
      </div>
    </div>

    <SlideThumbnails 
      v-if="slideThumbnailModelVisible" 
      :turnSlideToIndex="turnSlideToIndex" 
      @close="slideThumbnailModelVisible = false"
    />

    <WritingBoardTool v-if="writingBoardToolVisible" @close="writingBoardToolVisible = false" />

    <div class="tools">
      <IconLeftTwo class="tool-btn" theme="two-tone" :fill="['#111', '#fff']" @click="execPrev()" />
      <IconRightTwo class="tool-btn" theme="two-tone" :fill="['#111', '#fff']" @click="execNext()" />
      <IconWrite class="tool-btn" theme="two-tone" :fill="['#111', '#fff']" @click="writingBoardToolVisible = true" />
    </div>

    <div class="page-number" @click="slideThumbnailModelVisible = true" v-if="showPageNumber">
      {{slideIndex + 1}} / {{slides.length}}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, provide, ref } from 'vue'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { VIEWPORT_SIZE } from '@/configs/canvas'
import { KEYS } from '@/configs/hotkey'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { isFullscreen } from '@/utils/fullscreen'
import useScreening from '@/hooks/useScreening'

import { message } from 'ant-design-vue'

import ScreenSlide from './ScreenSlide.vue'
import SlideThumbnails from './SlideThumbnails.vue'
import WritingBoardTool from './WritingBoardTool.vue'

export default defineComponent({
  name: 'screen',
  components: {
    ScreenSlide,
    SlideThumbnails,
    WritingBoardTool,
  },
  setup() {
    const slidesStore = useSlidesStore()
    const { slides, slideIndex, currentSlide, viewportRatio } = storeToRefs(slidesStore)

    const slideWidth = ref(0)
    const slideHeight = ref(0)

    const scale = computed(() => slideWidth.value / VIEWPORT_SIZE)

    const showPageNumber = ref(false)

    const slideThumbnailModelVisible = ref(false)

    const writingBoardToolVisible = ref(false)

    // 计算和更新幻灯片内容的尺寸（按比例自适应屏幕）
    const setSlideContentSize = () => {
      const winWidth = document.body.clientWidth
      const winHeight = document.body.clientHeight
      let width, height

      if (winHeight / winWidth === viewportRatio.value) {
        width = winWidth
        height = winHeight
      }
      else if (winHeight / winWidth > viewportRatio.value) {
        width = winWidth
        height = winWidth * viewportRatio.value
      }
      else {
        width = winHeight / viewportRatio.value
        height = winHeight
      }
      slideWidth.value = width
      slideHeight.value = height
    }

    // 窗口尺寸变化监听：窗口发生变化时更新幻灯片的大小
    // 如果退出了全屏，需要返回到编辑模式
    const { exitScreening } = useScreening()

    const windowResizeListener = () => {
      setSlideContentSize()
      if (!isFullscreen()) exitScreening()
    }

    onMounted(() => {
      setSlideContentSize()
      window.addEventListener('resize', windowResizeListener)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', windowResizeListener)
    })

    // 当前页的元素动画列表和当前执行到的位置
    const animations = computed(() => currentSlide.value.animations || [])
    const animationIndex = ref(0)

    // 执行元素的入场动画
    const runAnimation = () => {
      const prefix = 'animate__'
      const animation = animations.value[animationIndex.value]
      animationIndex.value += 1

      const elRef = document.querySelector(`#screen-element-${animation.elId} [class^=base-element-]`)
      if (elRef) {
        const animationName = `${prefix}${animation.type}`
        document.documentElement.style.setProperty('--animate-duration', `${animation.duration}ms`)
        elRef.classList.add(`${prefix}animated`, animationName)

        const handleAnimationEnd = () => {
          document.documentElement.style.removeProperty('--animate-duration')
          elRef.classList.remove(`${prefix}animated`, animationName)
        }
        elRef.addEventListener('animationend', handleAnimationEnd, { once: true })
      }
    }

    // 关闭自动播放
    const autoPlayTimer = ref(0)
    const closeAutoPlay = () => {
      if (autoPlayTimer.value) {
        clearInterval(autoPlayTimer.value)
        autoPlayTimer.value = 0
      }
    }
    onUnmounted(closeAutoPlay)

    const throttleMassage = throttle(function(msg) {
      message.success(msg)
    }, 1000, { leading: true, trailing: false })

    // 向上/向下播放
    // 遇到元素动画时，优先执行动画播放，无动画则执行翻页
    // 向上播放遇到动画时，仅撤销到动画执行前的状态，不需要反向播放动画
    const execPrev = () => {
      if (animations.value.length && animationIndex.value > 0) {
        animationIndex.value -= 1
      }
      else if (slideIndex.value > 0) {
        slidesStore.updateSlideIndex(slideIndex.value - 1)
        const lastIndex = animations.value ? animations.value.length : 0
        animationIndex.value = lastIndex
      }
      else {
        throttleMassage('已经是第一页了')
      }
    }
    const execNext = () => {
      if (animations.value.length && animationIndex.value < animations.value.length) {
        runAnimation()
      }
      else if (slideIndex.value < slides.value.length - 1) {
        slidesStore.updateSlideIndex(slideIndex.value + 1)
        animationIndex.value = 0
      }
      else {
        throttleMassage('已经是最后一页了')
        closeAutoPlay()
      }
    }

    // 自动播放
    const autoPlay = () => {
      closeAutoPlay()
      message.success('开始自动放映')
      autoPlayTimer.value = setInterval(execNext, 2500)
    }

    // 鼠标滚动翻页
    const mousewheelListener = throttle(function(e: WheelEvent) {
      if (e.deltaY < 0) execPrev()
      else if (e.deltaY > 0) execNext()
    }, 500, { leading: true, trailing: false })

    // 触摸屏上下滑动翻页
    const touchInfo = ref<{ x: number; y: number; } | null>(null)

    const touchStartListener = (e: TouchEvent) => {
      touchInfo.value = {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
      }
    }
    const touchEndListener = (e: TouchEvent) => {
      if (!touchInfo.value) return

      const offsetX = Math.abs(touchInfo.value.x - e.changedTouches[0].pageX)
      const offsetY = e.changedTouches[0].pageY - touchInfo.value.y

      if ( Math.abs(offsetY) > offsetX && Math.abs(offsetY) > 50 ) {
        touchInfo.value = null
  
        if (offsetY > 0) execPrev()
        else execNext()
      }
    }

    // 快捷键翻页
    const keydownListener = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (key === KEYS.UP || key === KEYS.LEFT) execPrev()
      else if (
        key === KEYS.DOWN || 
        key === KEYS.RIGHT ||
        key === KEYS.SPACE || 
        key === KEYS.ENTER
      ) execNext()
    }

    onMounted(() => {
      document.addEventListener('keydown', keydownListener)
    })
    onUnmounted(() => {
      document.removeEventListener('keydown', keydownListener)
    })

    // 切换到上一张/上一张幻灯片（无视元素的入场动画）
    const turnPrevSlide = () => {
      slidesStore.updateSlideIndex(slideIndex.value - 1)
      animationIndex.value = 0
    }
    const turnNextSlide = () => {
      slidesStore.updateSlideIndex(slideIndex.value + 1)
      animationIndex.value = 0
    }

    // 切换幻灯片到指定的页面
    const turnSlideToIndex = (index: number) => {
      slideThumbnailModelVisible.value = false
      slidesStore.updateSlideIndex(index)
      animationIndex.value = 0
    }
    const turnSlideToId = (id: string) => {
      const index = slides.value.findIndex(slide => slide.id === id)
      if (index !== -1) {
        slidesStore.updateSlideIndex(index)
        animationIndex.value = 0
      }
    }

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
          text: '显示页码',
          subText: showPageNumber.value ? '√' : '',
          handler: () => showPageNumber.value = !showPageNumber.value,
        },
        {
          text: '查看所有幻灯片',
          handler: () => slideThumbnailModelVisible.value = true,
        },
        {
          text: '画笔',
          handler: () => writingBoardToolVisible.value = true,
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
    
    provide('slideScale', scale)

    return {
      slides,
      slideIndex,
      currentSlide,
      slideWidth,
      slideHeight,
      scale,
      mousewheelListener,
      touchStartListener,
      touchEndListener,
      animationIndex,
      contextmenus,
      execPrev,
      execNext,
      slideThumbnailModelVisible,
      turnSlideToIndex,
      turnSlideToId,
      writingBoardToolVisible,
      showPageNumber,
    }
  },
})
</script>

<style lang="scss" scoped>
.pptist-screen {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #111;
}
.slide-list {
  background: #1d1d1d;
  position: relative;
  width: 100%;
  height: 100%;
}
.slide-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &.current {
    z-index: 2;
  }

  &.hide {
    opacity: 0;
  }

  &.turning-mode-no {
    &.before {
      transform: translateY(-100%);
    }
    &.after {
      transform: translateY(100%);
    }
  }
  &.turning-mode-fade {
    transition: opacity .75s;
    &.before {
      pointer-events: none;
      opacity: 0;
    }
    &.after {
      pointer-events: none;
      opacity: 0;
    }
  }
  &.turning-mode-slideX {
    transition: transform .35s;
    &.before {
      transform: translateX(-100%);
    }
    &.after {
      transform: translateX(100%);
    }
  }
  &.turning-mode-slideY {
    transition: transform .35s;
    &.before {
      transform: translateY(-100%);
    }
    &.after {
      transform: translateY(100%);
    }
  }
}
.slide-content {
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.tools {
  position: fixed;
  bottom: 8px;
  left: 8px;
  font-size: 25px;
  color: #666;
  z-index: 10;
  cursor: pointer;
}
.tool-btn {
  opacity: .35;

  &:hover {
    opacity: .9;
  }
  & + .tool-btn {
    margin-left: 8px;
  }
}
.page-number {
  position: fixed;
  bottom: 8px;
  right: 8px;
  padding: 8px 12px;
  color: #666;
  background-color: #eee;
  border-radius: $borderRadius;
  z-index: 10;
  cursor: pointer;
}
</style>