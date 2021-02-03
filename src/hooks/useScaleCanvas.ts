import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'

export default () => {
  const store = useStore()
  const canvasPercentage = computed(() => store.state.canvasPercentage)

  const scaleCanvas = (command: '+' | '-') => {
    let percentage = canvasPercentage.value
    const step = 5
    const max = 120
    const min = 60
    if (command === '+' && percentage <= max) percentage += step
    if (command === '-' && percentage >= min) percentage -= step
    
    store.commit(MutationTypes.SET_CANVAS_PERCENTAGE, percentage)
  }

  const setCanvasPercentage = (percentage: number) => {
    store.commit(MutationTypes.SET_CANVAS_PERCENTAGE, percentage)
  }
  
  return {
    scaleCanvas,
    setCanvasPercentage,
  }
}