import { useSlidesStore, useMainStore } from '@/store'
import { PPTTableElement } from '@/types/slides'
import { SearchAction } from '@/types/toolbar'

export default () => {
  const {searchObj} = useMainStore()
  const slidesStore = useSlidesStore()

  /**
   * dom节点中的文本列表
   * @param el 
   * @param lines 
   */
  const textsInElement = (el: HTMLElement, lines: string[]) => {
    for (let i = 0; i < el.childNodes.length; i++) {
      const child: any = el.childNodes[i]
      if (child.nodeName === '#text') {
        lines.push(child)
      }
      else if (child.childNodes.length === 1 && child.children.length === 0) {
        lines.push(child.innerText)
      }
      else {
        textsInElement(child, lines)
      }
    }
  }

  /**
   * 搜索element中内容出现次数
   * @param source 
   * @param element 
   * @returns count:number
   */
  const countInElement = (source: string, element: any) => {
    let count = 0
    const textLines: string[] = []

    const textContent = element?.content || element?.text?.content || ''
    if (textContent) {
      const divEl = document.createElement('div')
      /* bca-disable */
      divEl.innerHTML = textContent
      textsInElement(divEl, textLines)
    }
    if (element.type === 'table') {
      const rows = element.data
      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i]
        for (let j = 0; j < cells.length; j++) {
          cells[j].text && textLines.push(cells[j].text)
        }
      }
    }
    textLines.forEach((txt) => {
      count += (txt.match(new RegExp(source, 'g')) || []).length
    })
    return count
  }
  
  /**
   * 搜索slide[]中内容出现次数
   * @param source 
   * @param slides 
   * @returns count:出现次数，firstSlideIndex:第一次出现的slide
   */
  const countInSlides = (source: string, slides: any[]) => {
    let count = 0
    let firstSlideIndex = -1
    let firstElementIndex = 0
    for (let i = 0; i < slides.length; i++) {
      const elements = slides[i].elements
      for (let j = 0; j < elements.length; j++) {
        count += countInElement(source, elements[j])
        if (firstSlideIndex === -1 && count > 0) {
          firstSlideIndex = i
          firstElementIndex = j
        }
      }
    }
    return {
      count,
      firstSlideIndex,
      firstElementIndex,
    }
  }

  /**
   * 高亮
   * @param source 
   * @param el 
   * @param index 
   * @param ref: {counting: number, isEnd: boolean}
   */
  const highlight = (source: string, el: HTMLElement, index: number, ref: any = {counting: 0, isEnd: false}) => {
    for (let i = 0; i < el.childNodes.length; i++) {
      const child: any = el.childNodes[i]
      const target = '<span style="background-color: #ffc12a;">' + source + '</span>'
      if (child.nodeName === '#text' || (child.childNodes.length === 1 && child.children.length === 0)) {
        const txtCount = (child.textContent?.match(new RegExp(source, 'g')) || []).length
        ref.counting += txtCount
        if (ref.counting > index) {
          const repIndex = index - (ref.counting - txtCount)
          const reg = new RegExp('((?:.*?' + source + '.*?){' + repIndex + '}.*?)' + source, 'm')
          if (child.nodeName === '#text') {
            el.innerHTML = el.innerHTML?.replace(reg, '$1' + target) || ''
          }
          else {
            child.innerHTML = child.innerHTML?.replace(reg, '$1' + target) || null
          }
          ref.isEnd = true
          break
        }
      }
      else {
        highlight(source, child as HTMLElement, index, ref)
        if (ref.isEnd) {
          break
        }
      }
    }
  }

  /**
   * 取消高亮
   * @param source 
   * @param el 
   */
  const clearHighlight = () => {
    const element: any = slidesStore.slides[searchObj.slideIndex]?.elements[searchObj.elementIndex]
    if (element) {
      const selector = element.type === 'table' ? '.editable-table' : '.ProseMirror'
      const htmlEl = document.getElementById('editable-element-' + element.id)?.querySelector(selector) as HTMLElement
      const target = '<span style="background-color: #ffc12a;">' + searchObj.oldSearchText + '</span>'
      if (htmlEl) {
        htmlEl.innerHTML = htmlEl.innerHTML?.replace(target, searchObj.oldSearchText)
      }
    }
  }

  /**
   * 搜索
   * @param action:SearchActionType
   * @param startSlideIndex 指定开始slide
   */
  const search = (action: SearchAction = SearchAction.All, startSlideIndex = -1) => {
    const slides = slidesStore.slides
    let slideIndex = -1
    let hasFind = false
    let reStart = false
    const {oldSearchText, searchText, searchNum, searchCount, subIndexInSlide, subIndexInElement} = searchObj

    // check
    if (!searchObj.searchText) {
      searchObj.searchCount = 0
      searchObj.searchNum = 0
      clearHighlight()
      return
    }
    if (action !== SearchAction.All && action !== SearchAction.Silent && searchCount <= 0) {
      return
    }

    // init
    clearHighlight()
    if (action === SearchAction.All && oldSearchText === searchText) {
      action = SearchAction.Next
    }
    if (action === SearchAction.Next && searchNum === searchCount) {
      startSlideIndex = 0
      searchObj.searchNum = 0
      searchObj.subIndexInSlide = 0
      searchObj.subIndexInElement = 0
      reStart = true
    }
    if (action === SearchAction.Prev && searchNum <= 1) {
      startSlideIndex = slides.length - 1
      searchObj.searchNum = searchCount + 1
      searchObj.subIndexInSlide = 0
      searchObj.subIndexInElement = 0
      reStart = true
    }
    if (action === SearchAction.All || action === SearchAction.Silent) {
      searchObj.oldSearchText = searchText
    }

    // search all
    if (action === SearchAction.All || action === SearchAction.Silent) {
      const {count, firstSlideIndex} = countInSlides(searchText, slides)
      slideIndex = firstSlideIndex
      searchObj.searchCount = count
      searchObj.searchNum = action === SearchAction.Silent ? 0 : (count > 0 ? 1 : 0)
      searchObj.subIndexInSlide = 0
      searchObj.subIndexInElement = 0
      hasFind = count > 0

      const {
        count: currentSlideCount,
        firstElementIndex: curSlideFirstElementIndex
      } = countInSlides(searchText, [slides[slidesStore.slideIndex]])
      if (currentSlideCount > 0) {
        if (slidesStore.slideIndex === 0) {
          searchObj.searchNum = 1
        }
        else {
          const {count: preCount} = countInSlides(searchText, slides.slice(0, slidesStore.slideIndex))
          searchObj.searchNum = preCount + 1
        }
        searchObj.elementIndex = curSlideFirstElementIndex
        slideIndex = slidesStore.slideIndex
      }
    }

    // search from current slide
    const newSearch = searchObj.slideIndex !== slidesStore.slideIndex
    if (action !== SearchAction.All && newSearch) {
      searchObj.subIndexInSlide = 0
    }

    // search next
    if (action === SearchAction.Next || action === SearchAction.Replace) {
      startSlideIndex = startSlideIndex >= 0 ? startSlideIndex : slidesStore.slideIndex
      for (let i = startSlideIndex; i < slides.length; i++) {
        slideIndex = i
        let slideTextCounting = 0 // 当前slide中动态匹配到的个数
        const elements = slides[i].elements
        for (let j = 0; j < elements.length; j++) {
          const matchCount = countInElement(searchText, elements[j])
          if (matchCount) {
            slideTextCounting += matchCount
            if (newSearch) {
              searchObj.subIndexInSlide = 0
              searchObj.subIndexInElement = 0
              searchObj.searchNum = (startSlideIndex > 0 ? countInSlides(searchText, slides.slice(0, startSlideIndex)).count : 0) + 1
              searchObj.elementIndex = j
              hasFind = true
              break
            }
            else {
              if (slideIndex !== slidesStore.slideIndex) {
                // other slide
                searchObj.subIndexInSlide = 0
                searchObj.subIndexInElement = 0
                searchObj.searchNum++
                searchObj.elementIndex = j
                hasFind = true
                break
              }
              if (reStart || slideTextCounting - searchObj.subIndexInSlide > 1) {
                // current slide
                if (!reStart && (action === SearchAction.Next || (action === SearchAction.Replace && searchObj.replaceText.startsWith(searchText)))) {
                  searchObj.subIndexInSlide++
                  searchObj.subIndexInElement = searchObj.elementIndex !== j || subIndexInElement >= matchCount - 1 
                    ? 0
                    : searchObj.subIndexInElement + 1
                }
                searchObj.searchNum++
                searchObj.elementIndex = j
                hasFind = true
                break
              }
            }
          }
        }
        if (hasFind) {
          break
        }
      }
      if (!hasFind && searchObj.searchCount > 0) {
        search(SearchAction.All, 0)
      }
    }

    // search prev
    if (action === SearchAction.Prev) {
      startSlideIndex = startSlideIndex >= 0 ? startSlideIndex : slidesStore.slideIndex
      for (let i = startSlideIndex; i >= 0; i--) {
        slideIndex = i
        let slideTextCounting = 0 // 当前slide中动态匹配到的个数
        const elements = slides[i].elements
        for (let j = elements.length - 1; j >= 0; j--) {
          const matchCount = countInElement(searchText, elements[j])
          if (matchCount) {
            slideTextCounting += matchCount
            const {count: slideTextCount} = countInSlides(searchText, [slides[slideIndex]])
            if (newSearch) {
              searchObj.subIndexInSlide = slideTextCount - 1
              searchObj.subIndexInElement = matchCount - 1
              const {count} = countInSlides(searchText, slides.slice(0, slideIndex + 1))
              searchObj.searchNum = count
              searchObj.elementIndex = j
              hasFind = true
              break
            }
            else {
              if (slideIndex !== slidesStore.slideIndex) {
                // new slide
                searchObj.subIndexInSlide = slideTextCount - 1
                searchObj.subIndexInElement = matchCount - 1
                searchObj.searchNum--
                searchObj.elementIndex = j
                hasFind = true
                break
              }
              if (reStart || (searchObj.subIndexInSlide - 1 >= 0 && (
                matchCount > 1 
                  ? searchObj.subIndexInElement !== 0
                  : subIndexInSlide > slideTextCount - slideTextCounting
              ))) {
                // current slide
                if (!reStart) {
                  searchObj.subIndexInSlide--
                  searchObj.subIndexInElement = subIndexInElement > 0
                    ? searchObj.subIndexInElement - 1
                    : matchCount - 1
                }
                else {
                  searchObj.subIndexInSlide = slideTextCount - 1
                  searchObj.subIndexInElement = matchCount - 1
                }
                searchObj.searchNum--
                searchObj.elementIndex = j
                hasFind = true
                break
              }
            }
          }
        }
        if (hasFind) {
          break
        }
      }
    }
    
    if (hasFind) {
      searchObj.slideIndex = slideIndex
      if (action !== SearchAction.Silent) {
        slidesStore.updateSlideIndex(slideIndex)
      }
      // hightlight
      setTimeout(() => {
        const element: any = slidesStore.slides[searchObj.slideIndex].elements[searchObj.elementIndex]
        const selector = element.type === 'table' ? '.editable-table' : '.ProseMirror'
        const htmlEl = document.getElementById('editable-element-' + element.id)?.querySelector(selector) as HTMLElement
        htmlEl && highlight(searchObj.searchText, htmlEl, searchObj.subIndexInElement)
      }, 0)
    }
  }

  /**
   * 替换element中的内容
   * @param source 
   * @param target 
   * @param el 
   * @param index 替换第几个，-1表示替换全部
   * @param ref: {count动态计数, isEnd是否结束}
   */
  const replaceInElement = (source: string, target: string, el: HTMLElement, index: number, ref = {count: 0, isEnd: false}) => {
    const {childNodes} = el
    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i]
      if (child.nodeName === '#text') {
        // TODO child.textContent = 'undefined'
        if (index < 0) {
          child.textContent = child.textContent?.replaceAll(source, target) || null
        }
        else {
          const txtCount = (child.textContent?.match(new RegExp(source, 'g')) || []).length
          ref.count += txtCount
          if (ref.count > index) {
            const repIndex = index - (ref.count - txtCount)
            child.textContent = child.textContent?.replace(new RegExp('((?:.*?' + source + '.*?){' + repIndex + '}.*?)' + source, 'm'), '$1' + target) || null
            ref.isEnd = true
            break
          }
        }
      }
      else {
        replaceInElement(source, target, child as HTMLElement, index, ref)
        if (ref.isEnd) {
          break
        }
      }
    }
  }

  /**
   * 替换element(table)中的内容
   * @param source 
   * @param target 
   * @param el: PPTTableElement
   * @param index 替换第几个，-1表示替换全部
   */
  const replaceInTable = (source: string, target: string, el: PPTTableElement, index: number) => {
    const rows = el.data
    let count = 0
    let isEnd = false
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i]
      for (let j = 0; j < cells.length; j++) {
        const cell = cells[j]
        const txtCount = (cell.text?.match(new RegExp(source, 'g')) || []).length
        count += txtCount
        let replace = false
        if (txtCount > 0 && index < 0) {
          replace = true
          cell.text = cell.text.replaceAll(source, target)
        }
        if (txtCount > 0 && index >= 0 && count > index) {
          const repIndex = index - (count - txtCount)
          cell.text = cell.text?.replace(new RegExp('((?:.*?' + source + '.*?){' + repIndex + '}.*?)' + source, 'm'), '$1' + target)
          replace = true
          isEnd = true
        }
        // TODO pptist未自动更新
        if (replace) {
          const htmlEl = document.getElementById('editable-element-' + el.id)
          if (htmlEl) {
            const tbEl = htmlEl.querySelector('.editable-table') as HTMLElement
            const cellEl = tbEl.querySelectorAll('td')[i * rows[i].length + j]
            cellEl.innerHTML = cellEl.innerHTML.replace(cellEl.innerText, cell.text)
          }
        }
        if (isEnd) {
          break
        }
      }
      if (isEnd) {
        break
      }
    }
  }

  /**
   * 替换
   * @returns 
   */
  const replace = () => {
    const {searchText, replaceText, searchCount, slideIndex, elementIndex, subIndexInSlide, subIndexInElement} = searchObj
    if (searchCount <= 0) {
      return
    }

    clearHighlight()
    
    // replace text in element
    const element: any = slidesStore.slides[slideIndex].elements[elementIndex]
    if (element.type === 'table') {
      replaceInTable(searchText, replaceText, element, subIndexInElement)
    }
    const textContent = element?.content || element?.text?.content || ''
    if (textContent) {
      const divEl = document.createElement('div')
      /* bca-disable */
      divEl.innerHTML = textContent
      replaceInElement(searchText, replaceText, divEl, subIndexInElement)
      if (element.content) {
        element.content = divEl.innerHTML
      }
      if (element.text && element.text.content) {
        element.text.content = divEl.innerHTML
      }
    }

    // update searchObj for search next
    const { count: slideTextCount } = countInSlides(searchText, [slidesStore.slides[slideIndex]])
    const canNext = !replaceText.startsWith(searchText)
    if (slideTextCount <= subIndexInSlide) {
      searchObj.slideIndex++
      searchObj.subIndexInSlide = 0
      searchObj.elementIndex = 0
      searchObj.subIndexInElement = 0
    }
    if (canNext) {
      searchObj.searchCount--
      searchObj.searchNum-- // 自动搜索下一个会矫正
    }
    search(SearchAction.Replace, searchObj.slideIndex)
  }

  /**
   * 替换全部
   * @returns 
   */
  const replaceAll = () => {
    const {searchText, replaceText} = searchObj
    if (searchObj.searchCount <= 0) {
      return
    }

    const slides = slidesStore.slides
    const divEl = document.createElement('div')
    for (let i = 0; i < slides.length; i++) {
      const elements = slides[i].elements
      for (let j = 0; j < elements.length; j++) {
        const element: any = elements[j]
        if (element.type === 'table') {
          replaceInTable(searchText, replaceText, element, -1)
        }

        const textContent = element?.content || element?.text?.content || ''
        if (textContent) {
          divEl.innerHTML = textContent
          replaceInElement(searchText, replaceText, divEl, -1)
          if (element.content) {
            element.content = divEl.innerHTML
          }
          if (element.text && element.text.content) {
            element.text.content = divEl.innerHTML
          }
        }
      }
    }

    searchObj.searchCount = 0
    searchObj.searchNum = 0
  }

  /**
   * 取消搜索
   */
  const cancelSearch = () => {
    clearHighlight()
    searchObj.searchText = ''
    searchObj.replaceText = ''
    searchObj.searchNum = 0
    searchObj.searchCount = 0
    searchObj.slideIndex = 0
    searchObj.elementIndex = 0
    searchObj.subIndexInSlide = 0
    searchObj.subIndexInElement = 0
  }

  return {
    search,
    replace,
    replaceAll,
    cancelSearch,
  }
}