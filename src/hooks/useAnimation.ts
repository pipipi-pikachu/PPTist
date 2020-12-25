import { computed, Ref, ref } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'
import { Slide } from '@/types/slides'

const prefix = 'animate__'

export default (elId: string) => {
  const animationIndex = ref(-1)
  const needWaitAnimation = ref(false)

  const store = useStore<State>()
  const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)
  const animations = computed(() => currentSlide.value.animations || [])

  const elementIndexInAnimation = animations.value.findIndex(animation => animation.elId === elId)
  if(elementIndexInAnimation !== -1 && elementIndexInAnimation < animationIndex.value) {
    needWaitAnimation.value = true
  }

  const runAnimation = () => {
    const animations = currentSlide.value.animations || []
    if(!animations.length) return
    if(animationIndex.value >= animations.length - 1) return

    animationIndex.value += 1
    const animation = animations[animationIndex.value]

    const elRef = document.querySelector(`#screen-el-${animation.elId}`)
    if(elRef) {
      const animationName = `${prefix}${animation.type}`
      elRef.classList.add(`${prefix}animated`, animationName)
    }
  }

  const revokeAnimation = () => {
    const animations = currentSlide.value.animations || []
    if(!animations.length) return
    if(animationIndex.value <= 0) return

    animationIndex.value -= 1
    const animation = animations[animationIndex.value]

    const elRef = document.querySelector(`#screen-el-${animation.elId}`)
    if(elRef) {
      const animationName = `${prefix}${animation.type}`
      elRef.classList.remove(`${prefix}animated`, animationName)
    }
  }

  return {
    needWaitAnimation,
    runAnimation,
    revokeAnimation,
  }
}