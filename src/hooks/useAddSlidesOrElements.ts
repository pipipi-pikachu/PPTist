import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useSlidesStore, useMainStore } from '@/store'
import type { PPTElement, Slide } from '@/types/slides'
import { createSlideIdMap, createElementIdMap, getElementRange } from '@/utils/element'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

/**
 * 提供把外部元素数据或页面数据加入当前演示文稿的能力。
 *
 * @returns 包含添加元素数据和添加页面数据的方法集合。
 * @throws 当前 composable 不主动抛错；ID 生成、store 更新或历史快照写入异常会按运行时错误表现。
 * @remarks
 * - 添加元素时会重建元素 ID 和组合 ID，避免与当前页面已有数据冲突。
 * - 添加页面时会重建页面 ID、元素 ID、组合 ID 和动画 ID，并修正页面跳转链接。
 * - 添加操作完成后都会记录历史快照。
 */
export default () => {
  // 获取主状态 store，用于更新添加后的选中元素。
  const mainStore = useMainStore()
  // 获取幻灯片 store，用于读取当前页和新增元素/页面。
  const slidesStore = useSlidesStore()
  // 当前幻灯片响应式引用，用于判断粘贴元素是否与已有元素重叠。
  const { currentSlide } = storeToRefs(slidesStore)

  // 获取历史快照写入方法，用于添加后记录撤销点。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 添加一组指定元素数据到当前页面。
   *
   * @param elements - 元素列表数据，通常来自复制粘贴、导入或模板。
   * @returns 无显式返回值。
   * @throws 当元素列表为空、ID 生成失败或 store 更新失败时可能产生运行时异常。
   * @remarks
   * - 会为每个元素生成新 ID，并为同组元素生成新的 groupId。
   * - 如果首个元素与当前页同类型元素完全重叠，会整体偏移 10 个单位，直到不再重叠。
   * - 添加后会选中新生成的元素。
   */
  const addElementsFromData = (elements: PPTElement[]) => {
    // 为待添加元素生成元素 ID 和组合 ID 映射。
    const { groupIdMap, elIdMap } = createElementIdMap(elements)

    // 使用第一个元素作为重叠检测基准。
    const firstElement = elements[0]
    // 初始偏移为 0；若检测到重叠则逐次增加。
    let offset = 0
    // 记录当前偏移位置下是否存在相同类型且同范围的元素。
    let lastSameElement: PPTElement | undefined
    
    // 循环检测目标位置是否与当前页已有元素重叠。
    do {
      // 查找与首个待添加元素同类型、同外接范围的已有元素。
      lastSameElement = currentSlide.value.elements.find(el => {
        // 只比较同类型元素，避免不同类型同范围时也触发偏移。
        if (el.type !== firstElement.type) return false
  
        // 计算已有元素范围。
        const { minX: oMinX, maxX: oMaxX, minY: oMinY, maxY: oMaxY } = getElementRange(el)
        // 计算待添加首元素在当前偏移量下的范围。
        const { minX: nMinX, maxX: nMaxX, minY: nMinY, maxY: nMaxY } = getElementRange({
          ...firstElement,
          left: firstElement.left + offset,
          top: firstElement.top + offset
        })
        // 四个边界完全一致时，认为发生重叠。
        if (
          oMinX === nMinX &&
          oMaxX === nMaxX &&
          oMinY === nMinY &&
          oMaxY === nMaxY
        ) return true
  
        // 未完全重叠时继续查找。
        return false
      })
      // 如果存在重叠元素，则整体偏移 10 个单位再次检测。
      if (lastSameElement) offset += 10

    } while (lastSameElement)
    
    // 遍历待添加元素，写入新 ID、新位置和新组合 ID。
    for (const element of elements) {
      // 用新生成的元素 ID 替换旧 ID。
      element.id = elIdMap[element.id]

      // 根据重叠检测结果整体水平偏移。
      element.left = element.left + offset
      // 根据重叠检测结果整体垂直偏移。
      element.top = element.top + offset

      // 如果元素属于组合，则用新的 groupId 替换旧 groupId。
      if (element.groupId) element.groupId = groupIdMap[element.groupId]
    }
    // 将处理后的元素追加到当前页。
    slidesStore.addElement(elements)
    // 选中新加入的所有元素。
    mainStore.setActiveElementIdList(Object.values(elIdMap))
    // 记录历史快照，支持撤销添加操作。
    addHistorySnapshot()
  }

  /**
   * 添加一组指定页面数据。
   *
   * @param slides - 页面数据列表。
   * @returns 无显式返回值。
   * @throws ID 生成、store 更新或历史快照写入异常会向上表现为运行时错误。
   * @remarks
   * - 每页都会生成新页面 ID，避免与当前演示文稿中的页面冲突。
   * - 页面内元素、组合和动画 ID 也会重建。
   * - 页面跳转链接只在目标页面也属于本次添加范围时保留并改写，否则删除链接。
   */
  const addSlidesFromData = (slides: Slide[]) => {
    // 为待添加页面生成旧页面 ID 到新页面 ID 的映射。
    const slideIdMap = createSlideIdMap(slides)
    // 遍历每一页，重建页面内引用关系。
    const newSlides = slides.map(slide => {
      // 为当前页元素生成元素 ID 和组合 ID 映射。
      const { groupIdMap, elIdMap } = createElementIdMap(slide.elements)

      // 遍历当前页全部元素，替换元素 ID、组合 ID 和页面跳转链接。
      for (const element of slide.elements) {
        // 替换元素 ID，避免与已有元素冲突。
        element.id = elIdMap[element.id]
        // 替换组合 ID，保持组内元素仍属于同一个新组合。
        if (element.groupId) element.groupId = groupIdMap[element.groupId]
		
        // 若元素绑定了页面跳转链接
        if (element.link && element.link.type === 'slide') {

          // 待添加页面中包含该页面，则替换相关绑定关系
          if (slideIdMap[element.link.target]) {
            // 将旧目标页面 ID 改写为新目标页面 ID。
            element.link.target = slideIdMap[element.link.target]
          }
          // 待添加页面中不包含该页面，则删除该元素绑定的页面跳转
          else delete element.link
        }
      }
      // 动画id替换
      if (slide.animations) {
        // 遍历当前页动画，重建动画 ID 并重定向到新元素 ID。
        for (const animation of slide.animations) {
          // 生成新的动画 ID。
          animation.id = nanoid(10)
          // 将动画绑定元素 ID 从旧元素 ID 改写为新元素 ID。
          animation.elId = elIdMap[animation.elId]
        }
      }
      // 返回替换页面 ID 后的新页面对象。
      return {
        ...slide,
        id: slideIdMap[slide.id],
      }
    })
    // 将处理后的页面添加到演示文稿。
    slidesStore.addSlide(newSlides)
    // 记录历史快照，支持撤销添加页面操作。
    addHistorySnapshot()
  }

  // 返回外部数据添加方法。
  return {
    addElementsFromData,
    addSlidesFromData,
  }
}
