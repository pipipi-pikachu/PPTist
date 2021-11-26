import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'

export default () => {
  const mainStore = useMainStore()
  const { canvasPercentage } = storeToRefs(mainStore)

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

    mainStore.setCanvasPercentage(percentage)
  }

  /**
   * 设置画笔百分比
   * @param percentage 百分比（小数形式，如0.8）
   */
  const setCanvasPercentage = (percentage: number) => {
    mainStore.setCanvasPercentage(percentage)
  }
  
  return {
    scaleCanvas,
    setCanvasPercentage,
  }
}