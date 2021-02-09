import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'

export default () => {
  const store = useStore()
  const canvasPercentage = computed(() => store.state.canvasPercentage)

  /**
   * 缩放画布百分比
   * @param command 缩放命令：放大、缩小
   */
  const scaleCanvas = (command: '+' | '-') => {
    let percentage = canvasPercentage.value
    const step = 5
    const max = 120
    const min = 60
    if (command === '+' && percentage <= max) percentage += step
    if (command === '-' && percentage >= min) percentage -= step
    
    store.commit(MutationTypes.SET_CANVAS_PERCENTAGE, percentage)
  }

  /**
   * 设置画笔百分比
   * @param percentage 百分比（小数形式，如0.8）
   */
  const setCanvasPercentage = (percentage: number) => {
    store.commit(MutationTypes.SET_CANVAS_PERCENTAGE, percentage)
  }
  
  return {
    scaleCanvas,
    setCanvasPercentage,
  }
}