<template>
  <div class="hamster-ppt-screen">
    <div 
      class="slide-list"
      @mousewheel="$event => mousewheelListener($event)"
      v-contextmenu="contextmenus"
    >
      <div 
        :class="[
          'slide-item', 
          `turning-mode-${slide.turningMode || 'slideY'}`,
          {
            'show': index === slideIndex,
            'prev': index < slideIndex,
            'next': index > slideIndex,
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
        >
          <ScreenSlide 
            :scale="scale" 
            :slide="slide" 
            :animationIndex="animationIndex"
          />
        </div>
      </div>
    </div>

    <Modal
      v-model:visible="slideListModelVisible" 
      :footer="null" 
      centered
      :width="1020"
      :bodyStyle="{ padding: '50px 20px 20px 20px' }"
    >
      <div class="slide-list-model">
        <div 
          class="thumbnail"
          :class="{ 'active': index === slideIndex }"
          v-for="(slide, index) in slides" 
          :key="slide.id"
          @click="turnSlideToIndex(index)"
        >
          <ThumbnailSlide :slide="slide" :size="150" />
        </div>
      </div>
    </Modal>

    <WritingBoard ref="writingBoardRef" :color="writingBoardColor" :model="writingBoardModel" v-if="writingBoardVisible" />

    <div class="tools">
      <IconFont class="tool-btn" type="icon-left-circle" @click="execPrev()" />
      <IconFont class="tool-btn" type="icon-right-circle" @click="execNext()" />
      <IconFont class="tool-btn" type="icon-appstore" @click="slideListModelVisible = true" />
      <Popover trigger="click" v-model:visible="writingBoardConfigsVisible">
        <template #content>
          <div class="writing-board-configs">
            <div class="btn" @click="writingBoardModel = 'pen'; writingBoardConfigsVisible = false">画笔</div>
            <div class="btn" @click="writingBoardModel = 'eraser'; writingBoardConfigsVisible = false">橡皮擦</div>
            <div class="btn" @click="writingBoardRef.clearCanvas(); writingBoardConfigsVisible = false">擦除所有墨迹</div>
            <div class="btn" @click="writingBoardVisible = false; writingBoardConfigsVisible = false">关闭画笔</div>
            <div class="colors">
              <div 
                class="color" 
                :class="{ 'active': color === writingBoardColor }"
                v-for="color in writingBoardColors" 
                :key="color"
                :style="{ backgroundColor: color }"
                @click="writingBoardColor = color; writingBoardConfigsVisible = false"
              ></div>
            </div>
          </div>
        </template>
        <IconFont class="tool-btn" type="icon-edit" @click="writingBoardVisible = true" />
      </Popover>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, Ref, ref } from 'vue'
import { useStore } from 'vuex'
import throttle from 'lodash/throttle'
import { MutationTypes, State } from '@/store'
import { Slide } from '@/types/slides'
import { exitFullscreen, isFullscreen } from '@/utils/fullscreen'
import { VIEWPORT_ASPECT_RATIO, VIEWPORT_SIZE } from '@/configs/canvas'
import { KEYS } from '@/configs/hotkey'
import { ContextmenuItem } from '@/components/Contextmenu/types'

import ScreenSlide from './ScreenSlide.vue'
import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import WritingBoard from '@/components/WritingBoard.vue'

const writingBoardColors = ['#000000', '#ffffff', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c']

export default defineComponent({
  name: 'screen',
  components: {
    ScreenSlide,
    ThumbnailSlide,
    WritingBoard,
  },
  setup() {
    const store = useStore<State>()
    const slides = computed(() => store.state.slides)
    const slideIndex = computed(() => store.state.slideIndex)
    const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

    const slideWidth = ref(0)
    const slideHeight = ref(0)
    const scale = computed(() => slideWidth.value / VIEWPORT_SIZE)

    const slideListModelVisible = ref(false)

    const writingBoardRef = ref()
    const writingBoardVisible = ref(false)
    const writingBoardConfigsVisible = ref(false)
    const writingBoardColor = ref('#e2534d')
    const writingBoardModel = ref('pen')

    const setSlideContentSize = () => {
      const winWidth = document.body.clientWidth
      const winHeight = document.body.clientHeight
      let width, height

      if(winHeight / winWidth === VIEWPORT_ASPECT_RATIO) {
        width = winWidth
        height = winHeight
      }
      else if(winHeight / winWidth > VIEWPORT_ASPECT_RATIO) {
        width = winWidth
        height = winWidth * VIEWPORT_ASPECT_RATIO
      }
      else {
        width = winHeight / VIEWPORT_ASPECT_RATIO
        height = winHeight
      }
      slideWidth.value = width
      slideHeight.value = height
    }

    const windowResizeListener = () => {
      setSlideContentSize()
      if(!isFullscreen()) store.commit(MutationTypes.SET_SCREENING, false)
    }

    const animationIndex = ref(0)
    const animations = computed(() => currentSlide.value.animations || [])

    const runAnimation = () => {
      const prefix = 'animate__'
      const animation = animations.value[animationIndex.value]
      animationIndex.value += 1

      const elRef = document.querySelector(`#screen-element-${animation.elId} [class^=base-element-]`)
      if(elRef) {
        const animationName = `${prefix}${animation.type}`
        elRef.classList.add(`${prefix}animated`, animationName)

        const handleAnimationEnd = () => {
          elRef.classList.remove(`${prefix}animated`, animationName)
        }
        elRef.addEventListener('animationend', handleAnimationEnd, { once: true })
      }
    }

    const execPrev = () => {
      if(animations.value.length && animationIndex.value > 0) {
        animationIndex.value -= 1
      }
      else if(slideIndex.value > 0) {
        store.commit(MutationTypes.UPDATE_SLIDE_INDEX, slideIndex.value - 1)
        const lastIndex = animations.value ? animations.value.length : 0
        animationIndex.value = lastIndex
      }
    }
    const execNext = () => {
      if(animations.value.length && animationIndex.value < animations.value.length) {
        runAnimation()
      }
      else if(slideIndex.value < slides.value.length - 1) {
        store.commit(MutationTypes.UPDATE_SLIDE_INDEX, slideIndex.value + 1)
        animationIndex.value = 0
      }
    }

    const keydownListener = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if(key === KEYS.UP || key === KEYS.LEFT) execPrev()
      else if(key === KEYS.DOWN || key === KEYS.RIGHT) execNext()
    }

    const mousewheelListener = throttle(function(e: WheelEvent) {
      if(e.deltaY < 0) execPrev()
      else if(e.deltaY > 0) execNext()
    }, 500, { leading: true, trailing: false })

    onMounted(() => {
      window.addEventListener('resize', windowResizeListener)
      document.addEventListener('keydown', keydownListener)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', windowResizeListener)
      document.removeEventListener('keydown', keydownListener)
    })

    const turnPrevSlide = () => {
      store.commit(MutationTypes.UPDATE_SLIDE_INDEX, slideIndex.value - 1)
      animationIndex.value = 0
    }
    const turnNextSlide = () => {
      store.commit(MutationTypes.UPDATE_SLIDE_INDEX, slideIndex.value + 1)
      animationIndex.value = 0
    }

    const turnSlideToIndex = (index: number) => {
      slideListModelVisible.value = false
      store.commit(MutationTypes.UPDATE_SLIDE_INDEX, index)
      animationIndex.value = 0
    }

    const contextmenus = (): ContextmenuItem[] => {
      return [
        {
          text: '上一页',
          disable: slideIndex.value <= 0,
          handler: () => turnPrevSlide(),
        },
        {
          text: '下一页',
          disable: slideIndex.value >= slides.value.length - 1,
          handler: () => turnNextSlide(),
        },
        { divider: true },
        {
          text: '结束放映',
          subText: 'ESC',
          handler: exitFullscreen,
        },
      ]
    }

    return {
      slides,
      slideIndex,
      slideWidth,
      slideHeight,
      scale,
      mousewheelListener,
      animationIndex,
      contextmenus,
      execPrev,
      execNext,
      slideListModelVisible,
      writingBoardVisible,
      writingBoardConfigsVisible,
      turnSlideToIndex,
      writingBoardRef,
      writingBoardColors,
      writingBoardColor,
      writingBoardModel,
    }
  },
})
</script>

<style lang="scss" scoped>
.hamster-ppt-screen {
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

  &.show {
    z-index: 2;
  }

  &.turning-mode-no {
    &.prev {
      transform: translateY(-100%);
    }
    &.next {
      transform: translateY(100%);
    }
  }
  &.turning-mode-fade {
    transition: opacity .75s;

    &.prev {
      pointer-events: none;
      opacity: 0;
    }
    &.next {
      pointer-events: none;
      opacity: 0;
    }
  }
  &.turning-mode-slideX {
    transition: transform .35s;
    &.prev {
      transform: translateX(-100%);
    }
    &.next {
      transform: translateX(100%);
    }
  }
  &.turning-mode-slideY {
    transition: transform .35s;
    &.prev {
      transform: translateY(-100%);
    }
    &.next {
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
    opacity: .7;
  }
  & + .tool-btn {
    margin-left: 8px;
  }
}

.slide-list-model {
  height: 600px;
  padding: 5px 10px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: overlay;

  .thumbnail {
    width: 150px;
    margin-bottom: 12px;
    outline: 1px solid rgba($color: $themeColor, $alpha: .1);

    &.active {
      outline-color: $themeColor;
    }

    &:not(:nth-child(6n)) {
      margin-right: 12px;
    }
  }
}

.writing-board-configs {
  font-size: 12px;

  .btn {
    padding: 3px 10px;
    margin: 0 -10px;
    margin-bottom: 3px;
    cursor: pointer;

    &:hover {
      background-color: #ccc;
    }
  }
  .colors {
    display: flex;
    margin-top: 8px;
  }
  .color {
    width: 15px;
    height: 15px;
    outline: 1px solid #ccc;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }
    &.active {
      outline: 2px solid $themeColor;
    }

    & + .color {
      margin-left: 5px;
    }
  }
}
</style>