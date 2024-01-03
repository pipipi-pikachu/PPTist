import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTTableElement } from '@/types/slides'
import message from '@/utils/message'

interface SearchTextResult {
  elType: 'text' | 'shape'
  slideId: string
  elId: string
}
interface SearchTableResult {
  elType: 'table'
  slideId: string
  elId: string
  cellIndex: [number, number]
}

type SearchResult = SearchTextResult | SearchTableResult

type Modifiers = 'g' | 'gi'

export default () => {
  const mainStore = useMainStore()
  const slidesStore = useSlidesStore()
  const { handleElement } = storeToRefs(mainStore)
  const { slides, slideIndex, currentSlide } = storeToRefs(slidesStore)

  const searchWord = ref('')
  const replaceWord = ref('')
  const searchResults = ref<SearchResult[]>([])
  const searchIndex = ref(-1)

  const modifiers = ref<Modifiers>('g')
  
  const search = () => {
    const textList: SearchResult[] = []
    const matchRegex = new RegExp(searchWord.value, modifiers.value)
    const textRegex = /(<([^>]+)>)/g
  
    for (const slide of slides.value) {
      for (const el of slide.elements) {
        if (el.type === 'text') {
          const text = el.content.replace(textRegex, '')
          const rets = text.match(matchRegex)
          rets && textList.push(...new Array(rets.length).fill({
            slideId: slide.id,
            elId: el.id,
            elType: el.type,
          }))
        }
        else if (el.type === 'shape' && el.text && el.text.content) {
          const text = el.text.content.replace(textRegex, '')
          const rets = text.match(matchRegex)
          rets && textList.push(...new Array(rets.length).fill({
            slideId: slide.id,
            elId: el.id,
            elType: el.type,
          }))
        }
        else if (el.type === 'table') {
          for (let i = 0; i < el.data.length; i++) {
            const row = el.data[i]
            for (let j = 0; j < row.length; j++) {
              const cell = row[j]
              if (!cell.text) continue
              const text = cell.text.replace(textRegex, '')
              const rets = text.match(matchRegex)
              rets && textList.push(...new Array(rets.length).fill({
                slideId: slide.id,
                elId: el.id,
                elType: el.type,
                cellIndex: [i, j],
              }))
            }
          }
        }
      }
    }
    if (textList.length) {
      searchResults.value = textList
      searchIndex.value = 0
      highlightCurrentSlide()
    }
    else {
      message.warning('未查找到匹配项')
      clearMarks()
    }
  }
  
  const getTextNodeList = (dom: Node): Text[] => {
    const nodeList = [...dom.childNodes]
    const textNodes = []
    while (nodeList.length) {
      const node = nodeList.shift()!
      if (node.nodeType === node.TEXT_NODE) {
        (node as Text).wholeText && textNodes.push(node as Text)
      } 
      else {
        nodeList.unshift(...node.childNodes)
      }
    }
    return textNodes
  }
  
  const getTextInfoList = (textNodes: Text[]) => {
    let length = 0
    const textList = textNodes.map(node => {
      const startIdx = length, endIdx = length + node.wholeText.length
      length = endIdx
      return {
        text: node.wholeText,
        startIdx,
        endIdx
      }
    })
    return textList
  }
  
  type TextInfoList = ReturnType<typeof getTextInfoList>
  
  const getMatchList = (content: string, keyword: string) => {
    const reg = new RegExp(keyword, modifiers.value)
    const matchList = []
    let match = reg.exec(content)
    while (match) {
      matchList.push(match)
      match = reg.exec(content)
    }
    return matchList
  }
  
  const highlight = (textNodes: Text[], textList: TextInfoList, matchList: RegExpExecArray[], index: number) => {
    for (let i = matchList.length - 1; i >= 0; i--) {
      const match = matchList[i]
      const matchStart = match.index
      const matchEnd = matchStart + match[0].length
  
      for (let textIdx = 0; textIdx < textList.length; textIdx++) {
        const { text, startIdx, endIdx } = textList[textIdx]
        if (endIdx < matchStart) continue
        if (startIdx >= matchEnd) break
  
        let textNode = textNodes[textIdx]
        const nodeMatchStartIdx = Math.max(0, matchStart - startIdx)
        const nodeMatchLength = Math.min(endIdx, matchEnd) - startIdx - nodeMatchStartIdx
  
        if (nodeMatchStartIdx > 0) textNode = textNode.splitText(nodeMatchStartIdx)
        if (nodeMatchLength < textNode.wholeText.length) textNode.splitText(nodeMatchLength)
  
        const mark = document.createElement('mark')
        mark.dataset.index = index + i + ''
        mark.innerText = text.substring(nodeMatchStartIdx, nodeMatchStartIdx + nodeMatchLength)
        textNode.parentNode!.replaceChild(mark, textNode)
      }
    }
  }
  
  const highlightTableText = (nodes: NodeListOf<Element>, index: number) => {
    for (const node of nodes) {
      node.innerHTML = node.innerHTML.replace(new RegExp(searchWord.value, modifiers.value), () => {
        return `<mark data-index=${index++}>${searchWord.value}</mark>`
      })
    }
  }
  
  const clearMarks = () => {
    const markNodes = document.querySelectorAll('.editable-element mark')
    for (const mark of markNodes) {
      setTimeout(() => {
        const parentNode = mark.parentNode!
        const text = mark.textContent!
        parentNode.replaceChild(document.createTextNode(text), mark)
      }, 0)
    }
  }
  
  const highlightCurrentSlide = () => {
    clearMarks()
    
    setTimeout(() => {
      for (let i = 0; i < searchResults.value.length; i++) {
        const lastTarget = searchResults.value[i - 1]
        const target = searchResults.value[i]
        if (target.slideId !== currentSlide.value.id) continue
        if (lastTarget && lastTarget.elId === target.elId) continue
  
        const node = document.querySelector(`#editable-element-${target.elId}`)
        if (node) {
          if (target.elType === 'table') {
            const cells = node.querySelectorAll('.cell-text')
            highlightTableText(cells, i)
          }
          else {
            const textNodes = getTextNodeList(node)
            const textList = getTextInfoList(textNodes)
            const content = textList.map(({ text }) => text).join('')
            const matchList = getMatchList(content, searchWord.value)
            highlight(textNodes, textList, matchList, i)
          }
        }
      }
    }, 0)
  }
  
  const setActiveMark = () => {
    const markNodes = document.querySelectorAll('mark[data-index]')
    for (const node of markNodes) {
      setTimeout(() => {
        const index = (node as HTMLElement).dataset.index
        if (index !== undefined && +index === searchIndex.value) {
          node.classList.add('active')
        }
        else node.classList.remove('active')
      }, 0)
    }
  }
  
  const turnTarget = () => {
    if (searchIndex.value === -1) return
    
    const target = searchResults.value[searchIndex.value]
  
    if (target.slideId === currentSlide.value.id) setTimeout(setActiveMark, 0)
    else {
      const index = slides.value.findIndex(slide => slide.id === target.slideId)
      if (index !== -1) slidesStore.updateSlideIndex(index)
    }
  }
  
  const searchNext = () => {
    if (!searchWord.value) return message.warning('请先输入查找内容')
    mainStore.setActiveElementIdList([])
    if (searchIndex.value === -1) search()
    else if (searchIndex.value < searchResults.value.length - 1) searchIndex.value += 1
    else searchIndex.value = 0
    turnTarget()
  }
  
  const searchPrev = () => {
    if (!searchWord.value) return message.warning('请先输入查找内容')
    mainStore.setActiveElementIdList([])
    if (searchIndex.value === -1) search()
    else if (searchIndex.value > 0) searchIndex.value -= 1
    else searchIndex.value = searchResults.value.length - 1
    turnTarget()
  }
  
  const replace = () => {
    if (!searchWord.value) return
    if (searchIndex.value === -1) {
      searchNext()
      return
    }
  
    const target = searchResults.value[searchIndex.value]
    let targetElement = null
    if (target.elType === 'table') {
      const [i, j] = target.cellIndex
      targetElement = document.querySelector(`#editable-element-${target.elId} .cell[data-cell-index="${i}_${j}"] .cell-text`)
    }
    else targetElement = document.querySelector(`#editable-element-${target.elId} .ProseMirror`)
    if (!targetElement) return
  
    const fakeElement = document.createElement('div')
    fakeElement.innerHTML = targetElement.innerHTML
  
    let replaced = false
    const marks = fakeElement.querySelectorAll('mark[data-index]')
    for (const mark of marks) {
      const parentNode = mark.parentNode!
      if (mark.classList.contains('active')) {
        if (replaced) parentNode.removeChild(mark)
        else {
          parentNode.replaceChild(document.createTextNode(replaceWord.value), mark)
          replaced = true
        }
      }
      else {
        const text = mark.textContent!
        parentNode.replaceChild(document.createTextNode(text), mark)
      }
    }
  
    if (target.elType === 'text') {
      const props = { content: fakeElement.innerHTML }
      slidesStore.updateElement({ id: target.elId, props })
    }
    else if (target.elType === 'shape') {
      const el = currentSlide.value.elements.find(item => item.id === target.elId)
      if (el && el.type === 'shape' && el.text) {
        const props = { text: { ...el.text, content: fakeElement.innerHTML } }
        slidesStore.updateElement({ id: target.elId, props })
      }
    }
    else if (target.elType === 'table') {
      const el = currentSlide.value.elements.find(item => item.id === target.elId)
      if (el && el.type === 'table') {
        const data = el.data.map((row, i) => {
          if (i === target.cellIndex[0]) {
            return row.map((cell, j) => {
              if (j === target.cellIndex[1]) {
                return {
                  ...cell,
                  text: fakeElement.innerHTML,
                }
              }
              return cell
            })
          }
          return row
        })
        const props = { data }
        slidesStore.updateElement({ id: target.elId, props })
      }
    }
  
    searchResults.value.splice(searchIndex.value, 1)
    if (searchResults.value.length) {
      if (searchIndex.value > searchResults.value.length - 1) {
        searchIndex.value = 0
      }
      nextTick(() => {
        highlightCurrentSlide()
        turnTarget()
      })
    }
    else searchIndex.value = -1
  }
  
  const replaceAll = () => {
    if (!searchWord.value) return
    if (searchIndex.value === -1) {
      searchNext()
      return
    }
  
    for (let i = 0; i < searchResults.value.length; i++) {
      const lastTarget = searchResults.value[i - 1]
      const target = searchResults.value[i]
      if (lastTarget && lastTarget.elId === target.elId) continue
  
      const targetSlide = slides.value.find(item => item.id === target.slideId)
      if (!targetSlide) continue
      const targetElement = targetSlide.elements.find(item => item.id === target.elId)
      if (!targetElement) continue
  
      const fakeElement = document.createElement('div')
      if (targetElement.type === 'text') fakeElement.innerHTML = targetElement.content
      else if (targetElement.type === 'shape') fakeElement.innerHTML = targetElement.text?.content || ''
  
      if (target.elType === 'table') {
        const data = (targetElement as PPTTableElement).data.map(row => {
          return row.map(cell => {
            if (!cell.text) return cell
            return {
              ...cell,
              text: cell.text.replace(new RegExp(searchWord.value, 'g'), replaceWord.value),
            }
          })
        })
        const props = { data }
        slidesStore.updateElement({ id: target.elId, slideId: target.slideId, props })
      }
      else {
        const textNodes = getTextNodeList(fakeElement)
        const textList = getTextInfoList(textNodes)
        const content = textList.map(({ text }) => text).join('')
        const matchList = getMatchList(content, searchWord.value)
        highlight(textNodes, textList, matchList, i)
  
        const marks = fakeElement.querySelectorAll('mark[data-index]')
        let lastMarkIndex = -1
        for (const mark of marks) {
          const markIndex = +(mark as HTMLElement).dataset.index!
          const parentNode = mark.parentNode!
          if (markIndex === lastMarkIndex) parentNode.removeChild(mark)
          else {
            parentNode.replaceChild(document.createTextNode(replaceWord.value), mark)
            lastMarkIndex = markIndex
          }
        }
  
        if (target.elType === 'text') {
          const props = { content: fakeElement.innerHTML }
          slidesStore.updateElement({ id: target.elId, slideId: target.slideId, props })
        }
        else if (target.elType === 'shape') {
          const el = currentSlide.value.elements.find(item => item.id === target.elId)
          if (el && el.type === 'shape' && el.text) {
            const props = { text: { ...el.text, content: fakeElement.innerHTML } }
            slidesStore.updateElement({ id: target.elId, slideId: target.slideId, props })
          }
        }
      }
    }
    searchResults.value = []
    searchIndex.value = -1
  }

  const reset = () => {
    searchIndex.value = -1
    searchResults.value = []
  
    if (!searchWord.value) clearMarks()
  }
  
  watch(searchWord, reset)
  
  watch(slideIndex, () => {
    nextTick(() => {
      highlightCurrentSlide()
      setTimeout(setActiveMark, 0)
    })
  })
  
  watch(handleElement, () => {
    if (handleElement.value) {
      searchIndex.value = -1
      searchResults.value = []
      clearMarks()
    }
  })
  
  onBeforeUnmount(clearMarks)
  
  const toggleModifiers = () => {
    modifiers.value = modifiers.value === 'g' ? 'gi' : 'g'
    reset()
  }

  return {
    searchWord,
    replaceWord,
    searchResults,
    searchIndex,
    modifiers,
    searchNext,
    searchPrev,
    replace,
    replaceAll,
    toggleModifiers,
  }
}