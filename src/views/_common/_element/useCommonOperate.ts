import { computed, Ref } from 'vue'
import { OperatePoints, OperateResizablePointTypes, OperateBorderLineTypes } from '@/types/edit'

export default (scaleWidth: Ref<number>, scaleHeight: Ref<number>) => {
  const resizablePoints = computed(() => {
    return [
      { type: OperateResizablePointTypes.TL, direction: OperatePoints.LEFT_TOP, style: {} },
      { type: OperateResizablePointTypes.TC, direction: OperatePoints.TOP, style: {left: scaleWidth.value / 2 + 'px'} },
      { type: OperateResizablePointTypes.TR, direction: OperatePoints.RIGHT_TOP, style: {left: scaleWidth.value + 'px'} },
      { type: OperateResizablePointTypes.ML, direction: OperatePoints.LEFT, style: {top: scaleHeight.value / 2 + 'px'} },
      { type: OperateResizablePointTypes.MR, direction: OperatePoints.RIGHT, style: {left: scaleWidth.value + 'px', top: scaleHeight.value / 2 + 'px'} },
      { type: OperateResizablePointTypes.BL, direction: OperatePoints.LEFT_BOTTOM, style: {top: scaleHeight.value + 'px'} },
      { type: OperateResizablePointTypes.BC, direction: OperatePoints.BOTTOM, style: {left: scaleWidth.value / 2 + 'px', top: scaleHeight.value + 'px'} },
      { type: OperateResizablePointTypes.BR, direction: OperatePoints.RIGHT_BOTTOM, style: {left: scaleWidth.value + 'px', top: scaleHeight.value + 'px'} },
    ]
  })

  const borderLines = computed(() => {
    return [
      { type: OperateBorderLineTypes.T, style: {width: scaleWidth.value + 'px'} },
      { type: OperateBorderLineTypes.B, style: {top: scaleHeight.value + 'px', width: scaleWidth.value + 'px'} },
      { type: OperateBorderLineTypes.L, style: {height: scaleHeight.value + 'px'} },
      { type: OperateBorderLineTypes.R, style: {left: scaleWidth.value + 'px', height: scaleHeight.value + 'px'} },
    ]
  })

  return {
    scaleWidth,
    scaleHeight,
    resizablePoints,
    borderLines,
  }
}