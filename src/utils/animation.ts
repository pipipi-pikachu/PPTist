import type { PPTAnimation, PPTElement } from '@/types/slides'

/**
 * 判断一个动画是否作用于整个组合
 * @param animation 动画信息
 */
export const isGroupAnimation = (animation: PPTAnimation) => animation.target === 'group'

/**
 * 获取动画的唯一目标标识，用于区分作用目标相同的动画
 * 组合ID与元素ID理论上不会重复，但仍按作用目标区分，避免语义混淆
 * @param animation 动画信息
 */
export const getAnimationTargetKey = (animation: PPTAnimation) => {
  return `${animation.target || 'element'}:${animation.elId}`
}

/**
 * 获取动画实际作用的元素ID集合
 * 作用于组合的动画将展开为该组合下的全部成员，作用于元素的动画则为该元素本身
 * 若目标已不存在（例如元素被删除），返回空集合
 * @param animation 动画信息
 * @param elements 当前页面的元素列表
 */
export const getAnimationElementIds = (animation: PPTAnimation, elements: PPTElement[]) => {
  if (isGroupAnimation(animation)) {
    return elements.filter(el => el.groupId === animation.elId).map(el => el.id)
  }
  return elements.some(el => el.id === animation.elId) ? [animation.elId] : []
}

/**
 * 获取动画实际作用的元素集合，规则同 getAnimationElementIds
 * @param animation 动画信息
 * @param elements 当前页面的元素列表
 */
export const getAnimationElements = (animation: PPTAnimation, elements: PPTElement[]) => {
  if (isGroupAnimation(animation)) {
    return elements.filter(el => el.groupId === animation.elId)
  }
  const element = elements.find(el => el.id === animation.elId)
  return element ? [element] : []
}
