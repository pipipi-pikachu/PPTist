import { PPTElement } from '@/types/slides'

export const lockElement = (elementList: PPTElement[], handleElement: PPTElement, activeElementIdList: string[]) => {
  const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

  for(const element of copyOfElementList) {
    if(activeElementIdList.includes(handleElement.elId)) element.isLock = true
  }
  return copyOfElementList
}

export const unlockElement = (elementList: PPTElement[], handleElement: PPTElement) => {
  const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

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