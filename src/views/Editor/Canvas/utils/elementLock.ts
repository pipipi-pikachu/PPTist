import { PPTElement } from '@/types/slides'
import { ElementLockCommand, ElementLockCommands } from '@/types/edit'

const lock = (copyOfElementList: PPTElement[], handleElement: PPTElement, activeElementIdList: string[]) => {
  for(const element of copyOfElementList) {
    if(activeElementIdList.includes(handleElement.elId)) element.isLock = true
  }
  return copyOfElementList
}

const unlock = (copyOfElementList: PPTElement[], handleElement: PPTElement) => {
  if(handleElement.groupId) {
    for(const element of copyOfElementList) {
      if(element.groupId === handleElement.groupId) element.isLock = false
    }
    return copyOfElementList
  }
  
  for(const element of copyOfElementList) {
    if(element.elId === handleElement.elId) {
      element.isLock = false
      break
    }
  }
  return copyOfElementList
}

// 锁定&解锁 元素
export const lockElement = (elementList: PPTElement[], handleElement: PPTElement, activeElementIdList: string[], command: ElementLockCommand) => {
  const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

  if(command === ElementLockCommands.LOCK) return lock(copyOfElementList, handleElement, activeElementIdList)
  return unlock(copyOfElementList, handleElement)
}