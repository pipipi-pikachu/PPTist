import { useSlidesStore, useMainStore } from '@/store'
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
    if ((element.type === 'text' || element.type === 'shape') && (element?.content || element?.text?.content)) {
      const divEl = document.createElement('div')
      /* bca-disable */
      divEl.innerHTML = element?.content || element?.text?.content || ''
      const textLines: string[] = []
      textsInElement(divEl, textLines)
      textLines.forEach((txt) => {
        count += (txt.match(new RegExp(source, 'g')) || []).length
      })
    }
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
      const htmlEl = document.getElementById('editable-element-' + element.id)?.querySelector('.ProseMirror') as HTMLElement
      const target = '<span style="background-color: #ffc12a;">' + searchObj.oldSearchText + '</span>'
      if (htmlEl) {
        htmlEl.innerHTML = htmlEl.innerHTML?.replace(target, searchObj.oldSearchText)
      }
    }
  }

  /**
   * 搜索
   * @param action:SearchActionType
   * @param startSlideIndex 指定开始slide（4replace)
   */
  const search = (action: SearchAction = SearchAction.All, startSlideIndex = 0) => {
    const slides = slidesStore.slides
    let slideIndex = -1
    let hasFind = false
    const {oldSearchText, searchText, searchIndex, searchCount, subIndexInSlide, subIndexInElement} = searchObj

    if (!searchObj.searchText) {
      searchObj.searchCount = 0
      searchObj.searchIndex = 0
      return
    }
    if ((action === SearchAction.Next && searchIndex === searchCount)
      || (action === SearchAction.Prev && searchIndex === 1)
    ) {
      return
    }

    if (action === SearchAction.All && oldSearchText === searchText && searchIndex > 0 && searchIndex < searchCount) {
      action = SearchAction.Next
    }

    clearHighlight()
    if (action === SearchAction.All) {
      searchObj.oldSearchText = searchText
    }

    // search all
    if (action === SearchAction.All) {
      const {count, firstSlideIndex, firstElementIndex} = countInSlides(searchText, slides)
      slideIndex = firstSlideIndex
      searchObj.elementIndex = firstElementIndex
      searchObj.searchCount = count
      searchObj.searchIndex = count > 0 ? 1 : 0
      searchObj.subIndexInSlide = 0
      searchObj.subIndexInElement = 0
      hasFind = count > 0
    }

    // search from current slide
    const newSearch = searchObj.slideIndex !== slidesStore.slideIndex
    if (action !== SearchAction.All && newSearch) {
      searchObj.subIndexInSlide = 0
    }

    // search next
    if (action === SearchAction.Next) {
      for (let i = startSlideIndex || slidesStore.slideIndex; i < slides.length; i++) {
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
              const {count} = countInSlides(searchText, slides.slice(0, slidesStore.slideIndex))
              searchObj.searchIndex = count + 1
              searchObj.elementIndex = j
              hasFind = true
              break
            }
            else {
              if (slideIndex !== slidesStore.slideIndex) {
                // other slide
                searchObj.subIndexInSlide = 0
                searchObj.subIndexInElement = 0
                searchObj.searchIndex++
                hasFind = true
                searchObj.elementIndex = j
                break
              }
              if (searchObj.subIndexInSlide + 2 <= slideTextCounting) {
                // current slide
                searchObj.subIndexInSlide++
                searchObj.subIndexInElement = searchObj.elementIndex !== j || subIndexInElement >= matchCount - 1 
                  ? 0
                  : searchObj.subIndexInElement + 1
                searchObj.searchIndex++
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

    // search prev
    if (action === SearchAction.Prev) {
      for (let i = slidesStore.slideIndex; i >= 0; i--) {
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
              searchObj.searchIndex = count
              searchObj.elementIndex = j
              hasFind = true
              break
            }
            else {
              if (slideIndex !== slidesStore.slideIndex) {
                // new slide
                searchObj.subIndexInSlide = slideTextCount - 1
                searchObj.subIndexInElement = matchCount - 1
                searchObj.searchIndex--
                searchObj.elementIndex = j
                hasFind = true
                break
              }
              if (searchObj.subIndexInSlide - 1 >= 0 && (
                matchCount > 1 
                  ? searchObj.subIndexInElement !== 0
                  : subIndexInSlide > slideTextCount - slideTextCounting
              )) {
                // current slide
                searchObj.subIndexInSlide--
                searchObj.subIndexInElement = subIndexInElement > 0
                  ? searchObj.subIndexInElement - 1
                  : matchCount - 1
                searchObj.searchIndex--
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
      slidesStore.updateSlideIndex(slideIndex)
      // hightlight
      setTimeout(() => {
        const element: any = slidesStore.slides[searchObj.slideIndex].elements[searchObj.elementIndex]
        const htmlEl = document.getElementById('editable-element-' + element.id)?.querySelector('.ProseMirror') as HTMLElement
        htmlEl && highlight(searchObj.searchText, htmlEl, searchObj.subIndexInElement)
      }, 0)
    }
  }

  /**
   * 替换element中的内容
   * @param source 
   * @param target 
   * @param el 
   * @param count 动态计数
   * @param index 替换第几个，-1表示替换全部
   */
  const replaceInElement = (source: string, target: string, el: HTMLElement, index: number, count = 0) => {
    const {childNodes} = el
    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i]
      if (child.nodeName === '#text') {
        // TODO child.textContent = 'undefined'
        if (index < 0) {
          child.textContent = child.textContent?.replaceAll(source, target) || null
          break
        }

        const txtCount = (child.textContent?.match(new RegExp(source, 'g')) || []).length
        count += txtCount
        if (count > index) {
          const repIndex = index - (count - txtCount)
          child.textContent = child.textContent?.replace(new RegExp('((?:.*?' + source + '.*?){' + repIndex + '}.*?)' + source, 'm'), '$1' + target) || null
          break
        }
      }
      else {
        replaceInElement(source, target, child as HTMLElement, index, count)
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
    const divEl = document.createElement('div')
    /* bca-disable */
    divEl.innerHTML = element?.content || element?.text?.content
    replaceInElement(searchText, replaceText, divEl, subIndexInElement)
    if (element.content) {
      element.content = divEl.innerHTML
    }
    if (element.text && element.text.content) {
      element.text.content = divEl.innerHTML
    }

    // update searchObj for search next
    const { count: slideTextCount } = countInSlides(searchText, [slidesStore.slides[slideIndex]])
    if (slideTextCount > subIndexInSlide) {
      searchObj.subIndexInSlide--
      if (searchObj.subIndexInElement > 0) {
        const currElementTextCount = countInElement(searchText, element)
        if (currElementTextCount - 1 >= searchObj.subIndexInElement) {
          searchObj.subIndexInElement--
        }
        else {
          searchObj.subIndexInElement = 0
        }
      }
    }
    else {
      searchObj.slideIndex++
      searchObj.subIndexInSlide = 0
      searchObj.elementIndex = 0
      searchObj.subIndexInElement = 0
    }
    searchObj.searchCount--
    searchObj.searchIndex-- // 自动搜索下一个会矫正
    search(SearchAction.Next, searchObj.slideIndex)
  }

  /**
   * 替换全部
   * @returns 
   */
  const replaceAll = () => {
    if (searchObj.searchCount <= 0) {
      return
    }

    const slides = slidesStore.slides
    const divEl = document.createElement('div')
    for (let i = 0; i < slides.length; i++) {
      const elements = slides[i].elements
      for (let j = 0; j < elements.length; j++) {
        const element: any = elements[j]
        divEl.innerHTML = element?.content || element?.text?.content
        replaceInElement(searchObj.searchText, searchObj.replaceText, divEl, -1)
        if (element.content) {
          element.content = divEl.innerHTML
        }
        if (element.text && element.text.content) {
          element.text.content = divEl.innerHTML
        }
      }
    }

    searchObj.searchCount = 0
    searchObj.searchIndex = 0
  }

  /**
   * 取消搜索
   */
  const cancelSearch = () => {
    clearHighlight()
    searchObj.searchText = ''
    searchObj.replaceText = ''
    searchObj.searchIndex = 0
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