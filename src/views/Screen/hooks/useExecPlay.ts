import { onMounted, onUnmounted, ref } from 'vue'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { KEYS } from '@/configs/hotkey'
import { ANIMATION_CLASS_PREFIX } from '@/configs/animation'

import { message } from 'ant-design-vue'

export default () => {
  const slidesStore = useSlidesStore()
  const { slides, slideIndex, formatedAnimations } = storeToRefs(slidesStore)
  // The position where the element animation of the current page is executed
  const animationIndex = ref(0)

  // animation execution status
  const inAnimation = ref(false)

  // Minimum played page index
  const playedSlidesMinIndex = ref(slideIndex.value)

  // Perform element animation
  const runAnimation = () => {
    // While an animation is in progress, prevent other new animations from starting
    if (inAnimation.value) return

    const { animations, autoNext } = formatedAnimations.value[animationIndex.value]
    animationIndex.value += 1

    // Mark start animation
    inAnimation.value = true

    let endAnimationCount = 0

    // Execute all animations in this position in turn
    for (const animation of animations) {
      const elRef: HTMLElement | null = document.querySelector(`#screen-element-${animation.elId} [class^=base-element-]`)
      if (!elRef) {
        endAnimationCount += 1
        continue
      }

      const animationName = `${ANIMATION_CLASS_PREFIX}${animation.effect}`

      // Clear the original animation state (if any) before executing the animation
      elRef.style.removeProperty('--animate-duration')
      for (const classname of elRef.classList) {
        if (classname.indexOf(ANIMATION_CLASS_PREFIX) !== -1) elRef.classList.remove(classname, `${ANIMATION_CLASS_PREFIX}animated`)
      }

      // execute the animation
      elRef.style.setProperty('--animate-duration', `${animation.duration}ms`)
      elRef.classList.add(animationName, `${ANIMATION_CLASS_PREFIX}animated`)

      // Execute the end of the animation, and clear the animation state other than "exit"
      const handleAnimationEnd = () => {
        if (animation.type !== 'out') {
          elRef.style.removeProperty('--animate-duration')
          elRef.classList.remove(animationName, `${ANIMATION_CLASS_PREFIX}animated`)
        }

        // After judging that all the animations at this position have ended, mark the execution of the animation as completed, and try to continue to execute downwards (if necessary)
        endAnimationCount += 1
        if (endAnimationCount === animations.length) {
          inAnimation.value = false
          if (autoNext) runAnimation()
        }
      }
      elRef.addEventListener('animationend', handleAnimationEnd, { once: true })
    }
  }

  // Undo element animation, in addition to moving the index forward, you also need to clear the animation state
  const revokeAnimation = () => {
    animationIndex.value -= 1
    const { animations } = formatedAnimations.value[animationIndex.value]

    for (const animation of animations) {
      const elRef: HTMLElement | null = document.querySelector(`#screen-element-${animation.elId} [class^=base-element-]`)
      if (!elRef) continue

      elRef.style.removeProperty('--animate-duration')
      for (const classname of elRef.classList) {
        if (classname.indexOf(ANIMATION_CLASS_PREFIX) !== -1) elRef.classList.remove(classname, `${ANIMATION_CLASS_PREFIX}animated`)
      }
    }

    // If there is one and only emphasis animation at this position when undoing, continue to perform an undo
    if (animations.every(item => item.type === 'attention')) execPrev()
  }

  // turn off autoplay
  const autoPlayTimer = ref(0)
  const closeAutoPlay = () => {
    if (autoPlayTimer.value) {
      clearInterval(autoPlayTimer.value)
      autoPlayTimer.value = 0
    }
  }
  onUnmounted(closeAutoPlay)
  const throttleMassage = throttle(function(msg) {
    message. success(msg)
  }, 1000, { leading: true, trailing: false })
  // play up/down
  // When an element animation is encountered, the animation will be played first, and if there is no animation, the page will be turned
  // When playing upward and encountering an animation, it only undoes to the state before the animation is executed, and there is no need to play the animation in reverse
  // When returning to the previous page, if the page has never been played (meaning that there is no animation state), the animation index needs to be set to the minimum value (initial state), otherwise set to the maximum value (final state)
  const execPrev = () => {
    if (formatedAnimations.value.length && animationIndex.value > 0) {
      revokeAnimation()
    }
    else if (slideIndex. value > 0) {
      slidesStore.updateSlideIndex(slideIndex.value - 1)
      if (slideIndex.value < playedSlidesMinIndex.value) {
        animationIndex. value = 0
        playedSlidesMinIndex.value = slideIndex.value
      }
      else animationIndex.value = formatedAnimations.value.length
    }
    else {
      throttleMassage('It\'s already the first page')
    }
    inAnimation. value = false
  }
  const execNext = () => {
    if (formatedAnimations.value.length && animationIndex.value < formatedAnimations.value.length) {
      runAnimation()
    }
    else if (slideIndex. value < slides. value. length - 1) {
      slidesStore.updateSlideIndex(slideIndex.value + 1)
      animationIndex. value = 0
      inAnimation. value = false
    }
    else {
      throttleMassage('It\'s the last page')
      closeAutoPlay()
      inAnimation. value = false
    }
  }

  // Autoplay
  const autoPlay = () => {
    closeAutoPlay()
    message.success('Start automatic show')
    autoPlayTimer. value = setInterval(execNext, 2500)
  }

  // mouse scrolling
  const mousewheelListener = throttle(function(e: WheelEvent) {
    if (e.deltaY < 0) execPrev()
    else if (e.deltaY > 0) execNext()
  }, 500, { leading: true, trailing: false })

  // Swipe up and down on the touch screen to turn pages
  const touchInfo = ref<{ x: number; y: number; } | null>(null)

  const touchStartListener = (e: TouchEvent) => {
    touchInfo. value = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY,
    }
  }
  const touchEndListener = (e: TouchEvent) => {
    if (!touchInfo. value) return

    const offsetX = Math.abs(touchInfo.value.x - e.changedTouches[0].pageX)
    const offsetY = e.changedTouches[0].pageY - touchInfo.value.y

    if (Math.abs(offsetY) > offsetX && Math.abs(offsetY) > 50) {
      touchInfo. value = null

      if (offsetY > 0) execPrev()
      else execNext()
    }
  }

  // Shortcut key to turn page
  const keydownListener = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase()

    if (key === KEYS.UP || key === KEYS.LEFT || key === KEYS.PAGEUP) execPrev()
    else if (
      key === KEYS.DOWN ||
      key === KEYS.RIGHT ||
      key === KEYS. SPACE ||
      key === KEYS.ENTER ||
      key === KEYS. PAGEDOWN
    ) execNext()
  }

  onMounted(() => document. addEventListener('keydown', keydownListener))
  onUnmounted(() => document. removeEventListener('keydown', keydownListener))

  // Switch to the previous/previous slide (ignoring the element's entry animation)
  const turnPrevSlide = () => {
    slidesStore.updateSlideIndex(slideIndex.value - 1)
    animationIndex. value = 0
  }
  const turnNextSlide = () => {
    slidesStore.updateSlideIndex(slideIndex.value + 1)
    animationIndex. value = 0
  }

  // Switch the slideshow to the specified page
  const turnSlideToIndex = (index: number) => {
    slidesStore. updateSlideIndex(index)
    animationIndex. value = 0
  }
  const turnSlideToId = (id: string) => {
    const index = slides. value. findIndex(slide => slide. id === id)
    if (index !== -1) {
      slidesStore. updateSlideIndex(index)
      animationIndex. value = 0
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