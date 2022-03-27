import { computed, onMounted, onUnmounted, ref } from 'vue'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { KEYS } from '@/configs/hotkey'

import { message } from 'ant-design-vue'

export default () => {
  const slidesStore = useSlidesStore()
  const { slides, slideIndex, currentSlide } = storeToRefs(slidesStore)

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

  onMounted(() => document.addEventListener('keydown', keydownListener))
  onUnmounted(() => document.removeEventListener('keydown', keydownListener))

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

  return {
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
  }
}