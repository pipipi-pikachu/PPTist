import api from '@/services'
import { nanoid } from 'nanoid'
import type { PPTTextElement, Slide, TextType } from '@/types/slides'
import type { AIPPTSlide } from '@/types/AIPPT'
import { useSlidesStore } from '@/store'
import useAddSlidesOrElements from './useAddSlidesOrElements'
import useSlideHandler from './useSlideHandler'

const findClosestGreaterThanN = (templates: Slide[], n: number, type: TextType) => {
  if (n === 1) {
    const list = templates.filter(slide => {
      const items = slide.elements.filter(el => el.type === 'text' && el.textType === type)
      const titles = slide.elements.filter(el => el.type === 'text' && el.textType === 'title')
      const texts = slide.elements.filter(el => el.type === 'text' && el.textType === 'content')

      return !items.length && titles.length === 1 && texts.length === 1
    })

    if (list.length) return list
  }

  let target: Slide | null = null

  const list = templates.filter(slide => {
    const len = slide.elements.filter(el => el.type === 'text' && el.textType === type).length
    return len >= n
  })
  if (list.length === 0) {
    const sorted = templates.sort((a, b) => {
      const aLen = a.elements.filter(el => el.type === 'text' && el.textType === type).length
      const bLen = b.elements.filter(el => el.type === 'text' && el.textType === type).length
      return aLen - bLen
    })
    target = sorted[sorted.length - 1]
  }
  else {
    target = list.reduce((closest, current) => {
      const currentLen = current.elements.filter(el => el.type === 'text' && el.textType === type).length
      const closestLen = closest.elements.filter(el => el.type === 'text' && el.textType === type).length
      return (currentLen - n) <= (closestLen - n) ? current : closest
    })
  }

  return templates.filter(slide => {
    const len = slide.elements.filter(el => el.type === 'text' && el.textType === type).length
    const targetLen = target!.elements.filter(el => el.type === 'text' && el.textType === type).length
    return len === targetLen
  })
}

const getFontsizeInBox = ({
  text,
  fontSize,
  fontFamily,
  width,
  maxLine,
}: {
  text: string
  fontSize: number
  fontFamily: string
  width: number
  maxLine: number
}) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!

  let newFontSize = fontSize
  const minFontSize = 10

  while (newFontSize >= minFontSize) {
    context.font = `${newFontSize}px ${fontFamily}`
    const textWidth = context.measureText(text).width
    const line = Math.ceil(textWidth / width)

    if (line <= maxLine) return newFontSize

    const step = newFontSize <= 22 ? 1 : 2
    newFontSize = newFontSize - step
  }

  return minFontSize
}

const getFontInfo = (htmlString: string) => {
  const fontSizeRegex = /font-size:\s*(\d+)\s*px/i
  const fontFamilyRegex = /font-family:\s*['"]?([^'";]+)['"]?\s*(?=;|>|$)/i

  const defaultInfo = {
    fontSize: 16,
    fontFamily: 'Microsoft Yahei',
  }

  const fontSizeMatch = htmlString.match(fontSizeRegex)
  const fontFamilyMatch = htmlString.match(fontFamilyRegex)

  return {
    fontSize: fontSizeMatch ? (+fontSizeMatch[1].trim()) : defaultInfo.fontSize,
    fontFamily: fontFamilyMatch ? fontFamilyMatch[1].trim() : defaultInfo.fontFamily,
  }
}

const getNewTextElData = ({
  el,
  text,
  maxLine,
  longestText,
}: {
  el: PPTTextElement
  text: string
  maxLine: number
  longestText?: string
}) => {
  const padding = 10
  const width = el.width - padding * 2 - 10

  const fontInfo = getFontInfo(el.content)
  const size = getFontsizeInBox({
    text: longestText || text,
    fontSize: fontInfo.fontSize,
    fontFamily: fontInfo.fontFamily,
    width,
    maxLine,
  })

  let content = el.content

  const parser = new DOMParser()
  const doc = parser.parseFromString(content, 'text/html')

  const treeWalker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)

  const firstTextNode = treeWalker.nextNode()
  if (firstTextNode) firstTextNode.textContent = text

  if (doc.body.innerHTML.indexOf('font-size') === -1) {
    const p = doc.querySelector('p')
    if (p) p.style.fontSize = '16px'
  }

  content = doc.body.innerHTML.replace(/font-size:(.+?)px/g, `font-size: ${size}px`)

  return { ...el, content }
}

export default () => {
  const slidesStore = useSlidesStore()
  const { addSlidesFromData } = useAddSlidesOrElements()
  const { isEmptySlide } = useSlideHandler()

  const AIPPT = async () => {
    const templateSlides: Slide[] = await api.getMockData('template').then(ret => ret.slides)
    const _AISlides: AIPPTSlide[] = await api.getMockData('AIPPT')

    const AISlides = []
    for (const template of _AISlides) {
      if (template.type === 'content') {
        const items = template.data.items
        if (items.length === 5 || items.length === 6) {
          const items1 = items.slice(0, 3)
          const items2 = items.slice(3)
          AISlides.push({ ...template, data: { ...template.data, items: items1 } })
          AISlides.push({ ...template, data: { ...template.data, items: items2 } })
        }
        else if (items.length === 7 || items.length === 8) {
          const items1 = items.slice(0, 4)
          const items2 = items.slice(4)
          AISlides.push({ ...template, data: { ...template.data, items: items1 } })
          AISlides.push({ ...template, data: { ...template.data, items: items2 } })
        }
        else if (items.length === 9 || items.length === 10) {
          const items1 = items.slice(0, 3)
          const items2 = items.slice(3, 6)
          const items3 = items.slice(6)
          AISlides.push({ ...template, data: { ...template.data, items: items1 } })
          AISlides.push({ ...template, data: { ...template.data, items: items2 } })
          AISlides.push({ ...template, data: { ...template.data, items: items3 } })
        }
        else if (items.length > 10) {
          const items1 = items.slice(0, 4)
          const items2 = items.slice(4, 8)
          const items3 = items.slice(8)
          AISlides.push({ ...template, data: { ...template.data, items: items1 } })
          AISlides.push({ ...template, data: { ...template.data, items: items2 } })
          AISlides.push({ ...template, data: { ...template.data, items: items3 } })
        }
        else {
          AISlides.push(template)
        }
      }
      else AISlides.push(template)
    }

    const coverTemplates = templateSlides.filter(slide => slide.type === 'cover')
    const contentsTemplates = templateSlides.filter(slide => slide.type === 'contents')
    const transitionTemplates = templateSlides.filter(slide => slide.type === 'transition')
    const contentTemplates = templateSlides.filter(slide => slide.type === 'content')
    const endTemplates = templateSlides.filter(slide => slide.type === 'end')

    const coverTemplate = coverTemplates[Math.floor(Math.random() * coverTemplates.length)]
    const transitionTemplate = transitionTemplates[Math.floor(Math.random() * transitionTemplates.length)]
    const endTemplate = endTemplates[Math.floor(Math.random() * endTemplates.length)]

    const slides = []

    let transitionIndex = 0
    
    for (const item of AISlides) {
      if (item.type === 'cover') {
        const elements = coverTemplate.elements.map(el => {
          if (el.type === 'text' && el.textType === 'title' && item.data.title) {
            return getNewTextElData({ el, text: item.data.title, maxLine: 1 })
          }
          if (el.type === 'text' && el.textType === 'content' && item.data.text) {
            return getNewTextElData({ el, text: item.data.text, maxLine: 3 })
          }
          return el
        })
        slides.push({
          ...coverTemplate,
          id: nanoid(10),
          elements,
        })
      }
      else if (item.type === 'contents') {
        const _contentsTemplates = findClosestGreaterThanN(contentsTemplates, item.data.items.length, 'item')
        const contentsTemplate = _contentsTemplates[Math.floor(Math.random() * _contentsTemplates.length)]

        const sortedItemIds = contentsTemplate.elements.filter(el => el.type === 'text' && el.textType === 'item').sort((a, b) => {
          const aIndex = a.left + a.top * 2
          const bIndex = b.left + b.top * 2
          return aIndex - bIndex
        }).map(el => el.id)

        const longestText = item.data.items.reduce((longest, current) => current.length > longest.length ? current : longest, '')

        const elements = contentsTemplate.elements.map(el => {
          if (el.type === 'text' && el.textType === 'item') {
            const index = sortedItemIds.findIndex(id => id === el.id)
            const itemTitle = item.data.items[index]
            if (itemTitle) return getNewTextElData({ el, text: itemTitle, maxLine: 1, longestText })
          }
          return el
        })
        slides.push({
          ...contentsTemplate,
          id: nanoid(10),
          elements,
        })
      }
      else if (item.type === 'transition') {
        transitionIndex++
        const elements = transitionTemplate.elements.map(el => {
          if (el.type === 'text' && el.textType === 'title' && item.data.title) {
            return getNewTextElData({ el, text: item.data.title, maxLine: 1 })
          }
          if (el.type === 'text' && el.textType === 'content' && item.data.text) {
            return getNewTextElData({ el, text: item.data.text, maxLine: 3 })
          }
          if (el.type === 'text' && el.textType === 'partNumber') {
            return getNewTextElData({ el, text: transitionIndex + '', maxLine: 1 })
          }
          return el
        })
        slides.push({
          ...transitionTemplate,
          id: nanoid(10),
          elements,
        })
      }
      else if (item.type === 'content') {
        const _contentTemplates = findClosestGreaterThanN(contentTemplates, item.data.items.length, 'item')
        const contentTemplate = _contentTemplates[Math.floor(Math.random() * _contentTemplates.length)]

        const sortedTitleItemIds = contentTemplate.elements.filter(el => el.type === 'text' && el.textType === 'itemTitle').sort((a, b) => {
          const aIndex = a.left + a.top * 2
          const bIndex = b.left + b.top * 2
          return aIndex - bIndex
        }).map(el => el.id)

        const sortedTextItemIds = contentTemplate.elements.filter(el => el.type === 'text' && el.textType === 'item').sort((a, b) => {
          const aIndex = a.left + a.top * 2
          const bIndex = b.left + b.top * 2
          return aIndex - bIndex
        }).map(el => el.id)

        const itemTitles = []
        const itemTexts = []

        for (const _item of item.data.items) {
          if (_item.title) itemTitles.push(_item.title)
          if (_item.text) itemTexts.push(_item.text)
        }
        const longestTitle = itemTitles.reduce((longest, current) => current.length > longest.length ? current : longest, '')
        const longestText = itemTexts.reduce((longest, current) => current.length > longest.length ? current : longest, '')

        const elements = contentTemplate.elements.map(el => {
          if (item.data.items.length === 1) {
            const contentItem = item.data.items[0]
            if (el.type === 'text' && el.textType === 'content' && contentItem.text) {
              return getNewTextElData({ el, text: contentItem.text, maxLine: 6 })
            }
          }
          else {
            if (el.type === 'text' && el.textType === 'itemTitle') {
              const index = sortedTitleItemIds.findIndex(id => id === el.id)
              const contentItem = item.data.items[index]
              if (contentItem && contentItem.title) {
                return getNewTextElData({ el, text: contentItem.title, longestText: longestTitle, maxLine: 1 })
              }
              return { ...el, isInvalid: true }
            }
            if (el.type === 'text' && el.textType === 'item') {
              const index = sortedTextItemIds.findIndex(id => id === el.id)
              const contentItem = item.data.items[index]
              if (contentItem && contentItem.text) {
                return getNewTextElData({ el, text: contentItem.text, longestText, maxLine: 4 })
              }
              return { ...el, isInvalid: true }
            }
          }
          if (el.type === 'text' && el.textType === 'title' && item.data.title) {
            return getNewTextElData({ el, text: item.data.title, maxLine: 1 })
          }
          return el
        })
        slides.push({
          ...contentTemplate,
          id: nanoid(10),
          elements,
        })
      }
      else if (item.type === 'end') {
        slides.push({
          ...endTemplate,
          id: nanoid(10),
        })
      }
    }
    if (isEmptySlide.value) slidesStore.setSlides(slides)
    else addSlidesFromData(slides)
  }

  return {
    AIPPT,
  }
}