import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import { getElementRange, getElementListRange, getRectRotatedOffset } from '@/utils/element'
import useHistorySnapshot from './useHistorySnapshot'

/**
 * 单个非组合元素参与等距分布时的范围数据。
 *
 * @property min - 元素在当前轴向上的最小坐标。
 * @property max - 元素在当前轴向上的最大坐标。
 * @property el - 原始 PPT 元素数据。
 * @remarks 水平分布时 min/max 表示 x 轴范围，垂直分布时表示 y 轴范围。
 */
interface ElementItem {
  min: number
  max: number
  el: PPTElement
}

/**
 * 组合元素临时聚合结构。
 *
 * @property groupId - 组合 ID。
 * @property els - 当前选区中属于该组合的元素列表。
 * @remarks 聚合后组合会作为一个整体参与等距分布。
 */
interface GroupItem {
  groupId: string
  els: PPTElement[]
}

/**
 * 组合元素参与等距分布时的范围数据。
 *
 * @property min - 组合整体在当前轴向上的最小坐标。
 * @property max - 组合整体在当前轴向上的最大坐标。
 * @property els - 组合成员列表。
 * @remarks 组合整体移动时，组内成员之间的相对位置需要保持不变。
 */
interface GroupElementsItem {
  min: number
  max: number
  els: PPTElement[]
}

/**
 * 等距分布中的排序项。
 *
 * @remarks 可能是单个元素，也可能是一组组合元素。
 */
type Item = ElementItem | GroupElementsItem

/**
 * 元素目标位置记录。
 *
 * @property pos - 元素在目标轴向上的范围最小值。
 * @property el - 对应元素。
 * @remarks pos 不是最终 left/top；旋转元素需要结合旋转偏移换算。
 */
interface ElementWithPos {
  pos: number
  el: PPTElement
}

/**
 * 上一个分布项的轴向范围。
 *
 * @property min - 上一个项的目标最小坐标。
 * @property max - 上一个项的目标最大坐标。
 * @remarks 用于逐项计算下一个分布项的位置。
 */
interface LastPos {
  min: number
  max: number
}

/**
 * 提供选中元素的水平/垂直等距分布操作。
 *
 * @returns 包含可分布项数量、水平等距分布和垂直等距分布方法的对象。
 * @throws 当前 composable 不主动抛错；JSON 深拷贝、store 更新或历史快照写入异常会按运行时错误表现。
 * @remarks
 * - 组合元素会作为一个整体参与等距分布，组内成员保持相对位置。
 * - 旋转元素用视觉外接范围参与分布，再通过旋转偏移换算回 left/top。
 * - 分布项少于 2 时会出现除以 0 风险，调用方应根据 `displayItemCount` 控制按钮可用状态。
 */
export default () => {
  // 获取幻灯片 store，用于更新当前页元素列表。
  const slidesStore = useSlidesStore()
  // 读取当前选中元素 ID 和选中元素实体列表。
  const { activeElementIdList, activeElementList } = storeToRefs(useMainStore())
  // 当前幻灯片响应式引用。
  const { currentSlide } = storeToRefs(slidesStore)

  // 获取历史快照写入方法，用于分布后记录撤销点。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 当前选区中可作为“分布项”的数量。
   *
   * @returns 普通元素按 1 个计数，同一 groupId 的组合元素整体按 1 个计数。
   * @remarks UI 可用它判断是否满足等距分布的最小项数。
   */
  const displayItemCount = computed(() => {
    // 累计可分布项数量。
    let count = 0
    // 记录已经计数过的组合 ID，避免同组成员重复计数。
    const groupIdList: string[] = []
    // 遍历当前选区元素。
    for (const el of activeElementList.value) {
      // 非组合元素直接作为一个分布项。
      if (!el.groupId) count += 1
      // 组合元素只在第一次遇到该 groupId 时计数。
      else if (!groupIdList.includes(el.groupId)) {
        // 记录已处理组合 ID。
        groupIdList.push(el.groupId)
        // 同一组合整体作为一个分布项。
        count += 1
      }
    }
    // 返回可参与分布的项数。
    return count
  })

  /**
   * 将当前选中的元素按水平方向等距分布。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - 分布范围使用选区整体 minX/maxX。
   * - 每个组合整体参与排序和间距计算，组内成员按原相对偏移展开到目标位置。
   * - 旋转元素最终 left 需要扣除旋转后的视觉范围偏移。
   */
  const uniformHorizontalDisplay = () => {
    // 读取选区整体水平范围，作为分布起止边界。
    const { minX, maxX } = getElementListRange(activeElementList.value)
    // 深拷贝选中元素列表，后续整理单元素和组合项时不直接修改原对象。
    const copyOfActiveElementList: PPTElement[] = JSON.parse(JSON.stringify(activeElementList.value))
    // 深拷贝当前页全部元素，最后在这里写入目标位置。
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    // 分别获取普通元素和组合元素集合，并记录下每一项的范围
    const singleElemetList: ElementItem[] = []
    let groupList: GroupItem[] = []
    // 遍历选中元素，拆分为普通元素项和组合临时集合。
    for (const el of copyOfActiveElementList) {
      // 非组合元素单独参与等距分布。
      if (!el.groupId) {
        // 获取该元素视觉水平范围。
        const { minX, maxX } = getElementRange(el)
        // 保存为单元素分布项。
        singleElemetList.push({ min: minX, max: maxX, el })
      }
      // 组合元素需要按 groupId 聚合。
      else {
        // 查找当前 groupId 是否已经创建临时集合。
        const groupEl = groupList.find(item => item.groupId === el.groupId)
        // 首次遇到该组合时创建集合。
        if (!groupEl) groupList.push({ groupId: el.groupId, els: [el] })
        // 已存在集合时，把当前元素追加到对应组合。
        else {
          groupList = groupList.map(item => item.groupId === el.groupId ? { ...item, els: [...item.els, el] } : item)
        }
      }
    }
    // 存储格式化后的组合分布项。
    const formatedGroupList: GroupElementsItem[] = []
    // 将每个组合转换为带整体范围的分布项。
    for (const groupItem of groupList) {
      // 计算组合整体水平范围。
      const { minX, maxX } = getElementListRange(groupItem.els)
      // 保存组合整体范围和成员列表。
      formatedGroupList.push({ min: minX, max: maxX, els: groupItem.els })
    }

    // 将普通元素和组合元素集合组合在一起，然后将每一项按位置（从左到右）排序
    const list: Item[] = [...singleElemetList, ...formatedGroupList]
    // 按水平最小坐标升序排列，保证分布后左右顺序不变。
    list.sort((itemA, itemB) => itemA.min - itemB.min)

    // 计算元素均匀分布所需要的间隔：
    // (所选元素整体范围 - 所有所选元素宽度和) / (所选元素数 - 1)
    let totalWidth = 0
    // 累加所有分布项的宽度，组合项按整体宽度计算。
    for (const item of list) {
      // 当前项视觉宽度。
      const width = item.max - item.min
      // 累加宽度。
      totalWidth += width
    }
    // 计算相邻分布项之间的空白间距。
    const span = ((maxX - minX) - totalWidth) / (list.length - 1)

    // 按位置顺序依次计算每一个元素的目标位置
    // 第一项中的元素即为起点，无需计算
    // 从第二项开始，每一项的位置应该为：上一项位置 + 上一项宽度 + 间隔
    // 注意此处计算的位置（pos）并非元素最终的left值，而是目标位置范围最小值（元素旋转后的left值 ≠ 范围最小值）
    const sortedElementData: ElementWithPos[] = []

    const firstItem = list[0]
    let lastPos: LastPos = { min: firstItem.min, max: firstItem.max }

    if ('el' in firstItem) {
      sortedElementData.push({ pos: firstItem.min, el: firstItem.el })
    }
    else {
      for (const el of firstItem.els) {
        const { minX: pos } = getElementRange(el)
        sortedElementData.push({ pos, el })
      }
    }

    for (let i = 1; i < list.length; i++) {
      const item = list[i]
      const lastWidth = lastPos.max - lastPos.min
      const currentPos = lastPos.min + lastWidth + span
      const currentWidth = item.max - item.min
      lastPos = { min: currentPos, max: currentPos + currentWidth }

      if ('el' in item) {
        sortedElementData.push({ pos: currentPos, el: item.el })
      }
      else {
        for (const el of item.els) {
          const { minX } = getElementRange(el)
          const offset = minX - item.min
          sortedElementData.push({ pos: currentPos + offset, el })
        }
      }
    }

    // 根据目标位置计算元素最终目标left值
    // 对于旋转后的元素，需要计算旋转前后left的偏移来做校正
    for (const element of newElementList) {
      // 未选中元素不参与分布。
      if (!activeElementIdList.value.includes(element.id)) continue

      // 在已计算的目标位置列表中查找当前元素。
      for (const sortedItem of sortedElementData) {
        // 命中当前元素后写入目标 left。
        if (sortedItem.el.id === element.id) {
          // 旋转元素的视觉 minX 与 left 存在偏移，需要反向校正。
          if ('rotate' in element && element.rotate) {
            const { offsetX } = getRectRotatedOffset({
              left: element.left,
              top: element.top,
              width: element.width,
              height: element.height,
              rotate: element.rotate,
            })
            element.left = sortedItem.pos - offsetX
          }
          // 未旋转元素 left 等于视觉 minX，可直接写入。
          else element.left = sortedItem.pos
        }
      }
    }

    // 写回水平分布后的元素列表。
    slidesStore.updateSlide({ elements: newElementList })
    // 记录历史快照，支持撤销本次水平分布。
    addHistorySnapshot()
  }

  /**
   * 将当前选中的元素按垂直方向等距分布。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - 分布范围使用选区整体 minY/maxY。
   * - 算法与水平方向一致，只是轴向从 x/width/left 切换为 y/height/top。
   */
  const uniformVerticalDisplay = () => {
    // 读取选区整体垂直范围，作为分布起止边界。
    const { minY, maxY } = getElementListRange(activeElementList.value)
    // 深拷贝选中元素列表，避免整理分组时影响原响应式对象。
    const copyOfActiveElementList: PPTElement[] = JSON.parse(JSON.stringify(activeElementList.value))
    // 深拷贝当前页全部元素，最后在这里写入目标位置。
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    // 存储非组合元素的垂直范围项。
    const singleElemetList: ElementItem[] = []
    // 临时聚合同一 groupId 下的组合成员。
    let groupList: GroupItem[] = []
    // 遍历当前选中元素并拆分普通元素和组合元素。
    for (const el of copyOfActiveElementList) {
      // 非组合元素单独参与垂直分布。
      if (!el.groupId) {
        // 获取元素视觉垂直范围。
        const { minY, maxY } = getElementRange(el)
        // 保存为单元素分布项。
        singleElemetList.push({ min: minY, max: maxY, el })
      }
      // 组合元素按 groupId 聚合。
      else {
        // 查找当前 groupId 是否已经存在临时集合。
        const groupEl = groupList.find(item => item.groupId === el.groupId)
        // 首次遇到该组合时创建集合。
        if (!groupEl) groupList.push({ groupId: el.groupId, els: [el] })
        // 已存在集合时追加当前元素。
        else {
          groupList = groupList.map(item => item.groupId === el.groupId ? { ...item, els: [...item.els, el] } : item)
        }
      }
    }
    // 存储带整体垂直范围的组合分布项。
    const formatedGroupList: GroupElementsItem[] = []
    // 将组合临时集合转换为分布项。
    for (const groupItem of groupList) {
      // 计算组合整体垂直范围。
      const { minY, maxY } = getElementListRange(groupItem.els)
      // 保存组合范围和成员列表。
      formatedGroupList.push({ min: minY, max: maxY, els: groupItem.els })
    }

    // 合并普通元素和组合项。
    const list: Item[] = [...singleElemetList, ...formatedGroupList]
    // 按垂直最小坐标升序排列，保证分布后上下顺序不变。
    list.sort((itemA, itemB) => itemA.min - itemB.min)

    // 累加所有分布项高度。
    let totalHeight = 0
    for (const item of list) {
      // 当前项视觉高度。
      const height = item.max - item.min
      // 累加高度。
      totalHeight += height
    }
    // 计算相邻分布项之间的垂直空白间距。
    const span = ((maxY - minY) - totalHeight) / (list.length - 1)

    // 存储每个具体元素的目标垂直位置。
    const sortedElementData: ElementWithPos[] = []

    // 第一项保持在原始顶部位置，作为分布起点。
    const firstItem = list[0]
    // 记录上一项目标范围。
    let lastPos: LastPos = { min: firstItem.min, max: firstItem.max }

    // 第一项是单元素时，直接记录该元素目标位置。
    if ('el' in firstItem) {
      sortedElementData.push({ pos: firstItem.min, el: firstItem.el })
    }
    // 第一项是组合时，需要展开组内每个成员，并保留成员相对组合顶部的偏移。
    else {
      for (const el of firstItem.els) {
        // 当前成员的视觉顶部位置。
        const { minY: pos } = getElementRange(el)
        // 记录成员目标位置。
        sortedElementData.push({ pos, el })
      }
    }

    // 从第二项开始，逐项计算目标位置。
    for (let i = 1; i < list.length; i++) {
      // 当前分布项。
      const item = list[i]
      // 上一项目标高度。
      const lastHeight = lastPos.max - lastPos.min
      // 当前项目标顶部 = 上一项顶部 + 上一项高度 + 间距。
      const currentPos = lastPos.min + lastHeight + span
      // 当前项高度。
      const currentHeight = item.max - item.min
      // 更新上一项位置记录，供下一轮计算。
      lastPos = { min: currentPos, max: currentPos + currentHeight }

      // 当前项是单元素时，直接记录目标顶部。
      if ('el' in item) {
        sortedElementData.push({ pos: currentPos, el: item.el })
      }
      // 当前项是组合时，展开组内成员并保留相对组合顶部偏移。
      else {
        for (const el of item.els) {
          // 获取成员当前视觉顶部。
          const { minY } = getElementRange(el)
          // 计算成员相对组合整体顶部的偏移。
          const offset = minY - item.min
          // 组合移动到 currentPos 后，成员目标位置等于组合目标顶部加相对偏移。
          sortedElementData.push({ pos: currentPos + offset, el })
        }
      }
    }

    // 遍历当前页元素，把选中元素更新到目标 top。
    for (const element of newElementList) {
      // 未选中元素不参与分布。
      if (!activeElementIdList.value.includes(element.id)) continue

      // 查找当前元素对应的目标位置。
      for (const sortedItem of sortedElementData) {
        // 命中当前元素后写入目标 top。
        if (sortedItem.el.id === element.id) {
          // 旋转元素的视觉 minY 与 top 存在偏移，需要反向校正。
          if ('rotate' in element && element.rotate) {
            const { offsetY } = getRectRotatedOffset({
              left: element.left,
              top: element.top,
              width: element.width,
              height: element.height,
              rotate: element.rotate,
            })
            element.top = sortedItem.pos - offsetY
          }
          // 未旋转元素 top 等于视觉 minY，可直接写入。
          else element.top = sortedItem.pos
        }
      }
    }

    // 写回垂直分布后的元素列表。
    slidesStore.updateSlide({ elements: newElementList })
    // 记录历史快照，支持撤销本次垂直分布。
    addHistorySnapshot()
  }

  // 返回等距分布相关状态和操作方法。
  return {
    displayItemCount,
    uniformHorizontalDisplay,
    uniformVerticalDisplay,
  }
}
