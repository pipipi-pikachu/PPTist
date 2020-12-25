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
          <ScreenSlide :scale="scale" :slide="slide" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import throttle from 'lodash/throttle'
import { MutationTypes, State } from '@/store'
import { exitFullscreen, isFullscreen } from '@/utils/fullscreen'
import { VIEWPORT_ASPECT_RATIO, VIEWPORT_SIZE } from '@/configs/canvas'
import { KEYS } from '@/configs/hotkey'
import { ContextmenuItem } from '@/components/Contextmenu/types'

import ScreenSlide from './ScreenSlide.vue'

export default defineComponent({
  name: 'screen',
  components: {
    ScreenSlide,
  },
  setup() {
    const store = useStore<State>()
    const slides = computed(() => store.state.slides)
    const slideIndex = computed(() => store.state.slideIndex)

    const slideWidth = ref(0)
    const slideHeight = ref(0)
    const scale = computed(() => slideWidth.value / VIEWPORT_SIZE)

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

    const turnPrevSlide = () => {
      if(slideIndex.value <= 0) return
      store.commit(MutationTypes.UPDATE_SLIDE_INDEX, slideIndex.value - 1)
    }
    const turnNextSlide = () => {
      if(slideIndex.value >= slides.value.length - 1) return
      store.commit(MutationTypes.UPDATE_SLIDE_INDEX, slideIndex.value + 1)
    }

    const keydownListener = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if(key === KEYS.UP || key === KEYS.LEFT) turnPrevSlide()
      else if(key === KEYS.DOWN || key === KEYS.RIGHT) turnNextSlide()
    }

    const mousewheelListener = throttle(function(e: WheelEvent) {
      if(e.deltaY > 0) turnNextSlide()
      else if(e.deltaY < 0) turnPrevSlide()
    }, 500, { leading: true, trailing: false })

    onMounted(() => {
      window.addEventListener('resize', windowResizeListener)
      document.addEventListener('keydown', keydownListener)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', windowResizeListener)
      document.removeEventListener('keydown', keydownListener)
    })

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
      contextmenus,
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
  transition-property: transform;
  transition-duration: .4s;

  &.show {
    z-index: 2;
  }
  &.prev {
    transform: translateY(-100%);
  }
  &.next {
    transform: translateY(100%);
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
</style>