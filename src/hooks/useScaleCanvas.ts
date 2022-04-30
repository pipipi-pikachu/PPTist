import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'

export default () => {
  const mainStore = useMainStore()
  const { canvasPercentage, canvasScale, canvasDragged } = storeToRefs(mainStore)

  const canvasScalePercentage = computed(() => Math.round(canvasScale.value * 100) + '%')

  /**
   * 缩放画布百分比
   * @param command 缩放命令：放大、缩小
   */
  const scaleCanvas = (command: '+' | '-') => {
    let percentage = canvasPercentage.value
    const step = 5
    const max = 200
    const min = 30
    if (command === '+' && percentage <= max) percentage += step
    if (command === '-' && percentage >= min) percentage -= step

    mainStore.setCanvasPercentage(percentage)
  }

  /**
   * 设置画布缩放比例
   * 但不是直接设置该值，而是通过设置画布可视区域百分比来动态计算
   * @param value 目标画布缩放比例
   */
  const setCanvasScalePercentage = (value: number) => {
    const percentage = Math.round(value / canvasScale.value * canvasPercentage.value) / 100
    mainStore.setCanvasPercentage(percentage)
  }

  /**
   * 重置画布尺寸和位置
   */
  const resetCanvas = () => {
    mainStore.setCanvasPercentage(90)
    if (canvasDragged) mainStore.setCanvasDragged(false)
  }

  return {
    canvasScalePercentage,
    setCanvasScalePercentage,
    scaleCanvas,
    resetCanvas,
  }
}