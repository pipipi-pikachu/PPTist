import { createRandomCode } from '@/utils/common'
import { PPTElement } from '@/types/slides'

// 组合元素（为当前所有激活元素添加一个相同的groupId）
export const combineElements = (elementList: PPTElement[], activeElementList: PPTElement[], activeElementIdList: string[]) => {
  if(!activeElementList.length) return null

  let copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))
  const groupId = createRandomCode()

  const combineElementList: PPTElement[] = []
  for(const element of copyOfElementList) {
    if(activeElementIdList.includes(element.elId)) {
      element.groupId = groupId
      combineElementList.push(element)
    }
  }

  // 注意，组合元素的层级应该是连续的，所以需要获取该组元素中最顶层的元素，将组内其他成员从原位置移动到最顶层的元素的下面
  const combineElementMaxIndex = copyOfElementList.findIndex(_element => _element.elId === combineElementList[combineElementList.length - 1].elId)
  const combineElementIdList = combineElementList.map(_element => _element.elId)
  copyOfElementList = copyOfElementList.filter(_element => !combineElementIdList.includes(_element.elId))

  const insertIndex = combineElementMaxIndex - combineElementList.length + 1
  copyOfElementList.splice(insertIndex, 0, ...combineElementList)

  return copyOfElementList
}

// 取消组合元素（移除所有被激活元素的groupId）
export const uncombineElements = (elementList: PPTElement[], activeElementList: PPTElement[], activeElementIdList: string[]) => {
  if(!activeElementList.length) return null
  const hasElementInGroup = activeElementList.some(item => item.groupId)
  if(!hasElementInGroup) return null
  
  const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))
  for(const element of copyOfElementList) {
    if(activeElementIdList.includes(element.elId) && element.groupId) delete element.groupId
  }
  return copyOfElementList
}