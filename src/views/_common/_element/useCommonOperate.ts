import { computed, Ref } from 'vue'
import { OPERATE_KEYS, OperateResizablePointTypes, OperateBorderLineTypes } from '@/types/edit'

export default (scaleWidth: Ref<number>, scaleHeight: Ref<number>) => {
  const resizablePoints = computed(() => {
    return [
      { type: OperateResizablePointTypes.TL, direction: OPERATE_KEYS.LEFT_TOP, style: {} },
      { type: OperateResizablePointTypes.TC, direction: OPERATE_KEYS.TOP, style: {left: scaleWidth.value / 2 + 'px'} },
      { type: OperateResizablePointTypes.TR, direction: OPERATE_KEYS.RIGHT_TOP, style: {left: scaleWidth.value + 'px'} },
      { type: OperateResizablePointTypes.ML, direction: OPERATE_KEYS.LEFT, style: {top: scaleHeight.value / 2 + 'px'} },
      { type: OperateResizablePointTypes.MR, direction: OPERATE_KEYS.RIGHT, style: {left: scaleWidth.value + 'px', top: scaleHeight.value / 2 + 'px'} },
      { type: OperateResizablePointTypes.BL, direction: OPERATE_KEYS.LEFT_BOTTOM, style: {top: scaleHeight.value + 'px'} },
      { type: OperateResizablePointTypes.BC, direction: OPERATE_KEYS.BOTTOM, style: {left: scaleWidth.value / 2 + 'px', top: scaleHeight.value + 'px'} },
      { type: OperateResizablePointTypes.BR, direction: OPERATE_KEYS.RIGHT_BOTTOM, style: {left: scaleWidth.value + 'px', top: scaleHeight.value + 'px'} },
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