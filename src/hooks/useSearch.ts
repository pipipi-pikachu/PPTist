import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTTableElement } from '@/types/slides'
import message from '@/utils/message'

interface SearchTextResult {
  /** 命中文本所在元素类型，文本元素和形状内文本共用该结果结构。 */
  elType: 'text' | 'shape'
  /** 命中项所在幻灯片 ID。 */
  slideId: string
  /** 命中项所在元素 ID。 */
  elId: string
}
interface SearchTableResult {
  /** 表格命中结果固定为 table。 */
  elType: 'table'
  /** 命中项所在幻灯片 ID。 */
  slideId: string
  /** 命中项所在表格元素 ID。 */
  elId: string
  /** 命中单元格坐标，格式为 [行索引, 列索引]。 */
  cellIndex: [number, number]
}

// 搜索结果既可能来自普通文本/形状文本，也可能来自表格单元格。
type SearchResult = SearchTextResult | SearchTableResult

// 正则修饰符：g 表示区分大小写全局搜索，gi 表示忽略大小写全局搜索。
type Modifiers = 'g' | 'gi'

/**
 * 提供演示文稿内的查找、跳转、高亮、替换和全部替换能力。
 *
 * @returns 搜索面板需要的状态和操作函数。
 * @throws 当前组合式函数不主动抛错；用户输入会直接构造 RegExp，非法正则沿用运行时行为。
 * @remarks
 * - 搜索范围包括文本元素、形状内文本和表格单元格文本。
 * - 高亮是通过在当前页 DOM 中插入 `<mark>` 实现的，不会直接写回幻灯片数据。
 * - 替换时会基于 DOM 高亮副本生成新的 HTML，再写回 store。
 */
export default () => {
  // 主 store 用于清空当前选区，并监听当前操作元素变化。
  const mainStore = useMainStore()
  // 幻灯片 store 用于读取页面数据、切换页面和写回替换结果。
  const slidesStore = useSlidesStore()
  // 当前操作元素，用于用户开始编辑元素时清理搜索状态。
  const { handleElement } = storeToRefs(mainStore)
  // 当前文稿页面、当前页索引和当前页数据。
  const { slides, slideIndex, currentSlide } = storeToRefs(slidesStore)

  // 查找关键词。
  const searchWord = ref('')
  // 替换文本。
  const replaceWord = ref('')
  // 当前搜索结果列表；同一元素多次命中会生成多条结果。
  const searchResults = ref<SearchResult[]>([])
  // 当前命中的索引，-1 表示尚未开始搜索或没有结果。
  const searchIndex = ref(-1)

  // 正则修饰符，默认区分大小写。
  const modifiers = ref<Modifiers>('g')
  
  /**
   * 扫描所有幻灯片，生成搜索结果列表并高亮当前页。
   *
   * @returns 无显式返回值。
   * @throws 当 `searchWord` 不是合法正则表达式时，`new RegExp()` 会抛出异常；当前保持原逻辑不捕获。
   * @remarks
   * - 文本元素和形状文本会先去掉 HTML 标签再匹配。
   * - 表格单元格按单元格维度记录命中位置，便于替换时定位。
   */
  const search = () => {
    // 临时收集所有命中项。
    const textList: SearchResult[] = []
    // 根据当前搜索词和大小写模式创建正则；注意这里沿用用户输入的正则语义。
    const matchRegex = new RegExp(searchWord.value, modifiers.value)
    // 用于从富文本 HTML 中粗略去掉标签，仅保留文本内容参与搜索。
    const textRegex = /(<([^>]+)>)/g
  
    // 遍历所有幻灯片。
    for (const slide of slides.value) {
      // 遍历当前页所有元素。
      for (const el of slide.elements) {
        // 普通文本元素。
        if (el.type === 'text') {
          // 去掉 HTML 标签，避免标签内容干扰搜索结果。
          const text = el.content.replace(textRegex, '')
          // 查找全部匹配项。
          const rets = text.match(matchRegex)
          // 每个命中都追加一条结果，便于 next/prev 精确定位到第几处。
          rets && textList.push(...new Array(rets.length).fill({
            slideId: slide.id,
            elId: el.id,
            elType: el.type,
          }))
        }
        // 形状内文本。
        else if (el.type === 'shape' && el.text && el.text.content) {
          // 去掉形状文本 HTML 标签。
          const text = el.text.content.replace(textRegex, '')
          // 查找全部匹配项。
          const rets = text.match(matchRegex)
          // 每个命中都追加一条结果。
          rets && textList.push(...new Array(rets.length).fill({
            slideId: slide.id,
            elId: el.id,
            elType: el.type,
          }))
        }
        // 表格文本。
        else if (el.type === 'table') {
          // 遍历表格行。
          for (let i = 0; i < el.data.length; i++) {
            // 当前行。
            const row = el.data[i]
            // 遍历当前行单元格。
            for (let j = 0; j < row.length; j++) {
              // 当前单元格。
              const cell = row[j]
              // 空文本单元格跳过。
              if (!cell.text) continue
              // 去掉单元格文本中的 HTML 标签。
              const text = cell.text.replace(textRegex, '')
              // 查找全部匹配项。
              const rets = text.match(matchRegex)
              // 每个命中记录表格坐标。
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
    // 有命中项时写入结果并定位到第一条。
    if (textList.length) {
      // 保存全部搜索结果。
      searchResults.value = textList
      // 当前命中定位到第一项。
      searchIndex.value = 0
      // 高亮当前页所有匹配项。
      highlightCurrentSlide()
    }
    // 没有命中项时提示并清除旧高亮。
    else {
      // 提示无匹配。
      message.warning('未查找到匹配项')
      // 清理页面上遗留的 mark。
      clearMarks()
    }
  }
  
  /**
   * 获取 DOM 子树中的所有非空文本节点。
   *
   * @param dom - 需要遍历的 DOM 节点。
   * @returns 文本节点数组，顺序与 DOM 深度遍历顺序一致。
   * @throws 当前函数不主动抛错。
   * @remarks 使用显式队列遍历，方便后续按纯文本连续索引切分 mark。
   */
  const getTextNodeList = (dom: Node): Text[] => {
    // 初始化待遍历节点队列。
    const nodeList = [...dom.childNodes]
    // 收集有效文本节点。
    const textNodes = []
    // 队列不为空时持续遍历。
    while (nodeList.length) {
      // 取出队头节点。
      const node = nodeList.shift()!
      // 文本节点且内容非空时加入结果。
      if (node.nodeType === node.TEXT_NODE) {
        (node as Text).wholeText && textNodes.push(node as Text)
      } 
      // 非文本节点继续把其子节点放回队头，保持向下遍历。
      else {
        nodeList.unshift(...node.childNodes)
      }
    }
    // 返回文本节点列表。
    return textNodes
  }
  
  /**
   * 为文本节点列表计算连续文本区间信息。
   *
   * @param textNodes - 由 `getTextNodeList()` 收集的文本节点。
   * @returns 每个文本节点对应的文本、起始索引和结束索引。
   * @throws 当前函数不主动抛错。
   * @remarks 这些区间用于把整体匹配位置映射回具体 DOM Text 节点。
   */
  const getTextInfoList = (textNodes: Text[]) => {
    // 当前累计文本长度。
    let length = 0
    // 将每个文本节点映射为区间信息。
    const textList = textNodes.map(node => {
      // 当前节点起始索引和结束索引。
      const startIdx = length, endIdx = length + node.wholeText.length
      // 更新累计长度。
      length = endIdx
      // 返回当前节点文本和区间。
      return {
        text: node.wholeText,
        startIdx,
        endIdx
      }
    })
    // 返回完整区间列表。
    return textList
  }
  
  // 文本区间列表类型，保持和 getTextInfoList 返回值同步。
  type TextInfoList = ReturnType<typeof getTextInfoList>
  
  /**
   * 获取关键词在纯文本内容中的全部正则匹配。
   *
   * @param content - 已拼接的纯文本内容。
   * @param keyword - 搜索关键词，按正则表达式解释。
   * @returns RegExp exec 结果数组。
   * @throws 当 keyword 不是合法正则表达式时，`new RegExp()` 会抛出异常；当前保持原逻辑。
   * @remarks 当前使用全局正则循环 exec，便于获取每个匹配的起始索引。
   */
  const getMatchList = (content: string, keyword: string) => {
    // 创建当前大小写模式下的搜索正则。
    const reg = new RegExp(keyword, modifiers.value)
    // 收集匹配结果。
    const matchList = []
    // 获取第一处匹配。
    let match = reg.exec(content)
    // 循环读取所有匹配。
    while (match) {
      // 保存当前匹配。
      matchList.push(match)
      // 继续查找下一处匹配。
      match = reg.exec(content)
    }
    // 返回匹配列表。
    return matchList
  }
  
  /**
   * 根据匹配结果在文本节点中插入 mark 高亮。
   *
   * @param textNodes - 当前元素内的文本节点列表。
   * @param textList - 每个文本节点对应的连续文本区间。
   * @param matchList - 正则匹配结果列表。
   * @param index - 当前元素在全局 searchResults 中的起始索引。
   * @returns 无显式返回值；会直接改写 DOM。
   * @throws 当前函数不主动抛错；若文本节点已被外部修改，DOM split/replace 可能沿用浏览器行为。
   * @remarks
   * - 从后往前处理匹配，避免 splitText 改变前面尚未处理匹配的节点位置。
   * - 一个匹配跨多个 Text 节点时，会分别在对应节点片段上插入 mark。
   */
  const highlight = (textNodes: Text[], textList: TextInfoList, matchList: RegExpExecArray[], index: number) => {
    // 从最后一个匹配开始处理，减少 DOM 拆分带来的索引干扰。
    for (let i = matchList.length - 1; i >= 0; i--) {
      // 当前匹配结果。
      const match = matchList[i]
      // 当前匹配在整体文本中的起始索引。
      const matchStart = match.index
      // 当前匹配在整体文本中的结束索引。
      const matchEnd = matchStart + match[0].length
  
      // 遍历文本节点区间，找到和当前匹配相交的节点。
      for (let textIdx = 0; textIdx < textList.length; textIdx++) {
        // 当前文本节点内容和区间。
        const { text, startIdx, endIdx } = textList[textIdx]
        // 当前节点在匹配前方，继续找后面的节点。
        if (endIdx < matchStart) continue
        // 当前节点已经在匹配后方，结束本次匹配处理。
        if (startIdx >= matchEnd) break
  
        // 取对应真实文本节点。
        let textNode = textNodes[textIdx]
        // 匹配片段在当前文本节点内的起始偏移。
        const nodeMatchStartIdx = Math.max(0, matchStart - startIdx)
        // 匹配片段在当前文本节点内的长度。
        const nodeMatchLength = Math.min(endIdx, matchEnd) - startIdx - nodeMatchStartIdx
  
        // 如果匹配不是从当前文本节点开头开始，则先把前置文本拆出去。
        if (nodeMatchStartIdx > 0) textNode = textNode.splitText(nodeMatchStartIdx)
        // 如果匹配没有覆盖当前文本节点剩余全部内容，则把尾部文本拆出去。
        if (nodeMatchLength < textNode.wholeText.length) textNode.splitText(nodeMatchLength)
  
        // 创建高亮 mark。
        const mark = document.createElement('mark')
        // data-index 用于标识该 mark 对应全局搜索结果的第几项。
        mark.dataset.index = index + i + ''
        // 写入匹配片段文本。
        mark.innerText = text.substring(nodeMatchStartIdx, nodeMatchStartIdx + nodeMatchLength)
        // 用 mark 替换原文本节点片段。
        textNode.parentNode!.replaceChild(mark, textNode)
      }
    }
  }
  
  /**
   * 高亮表格单元格中的搜索词。
   *
   * @param nodes - 当前表格元素内的单元格文本节点集合。
   * @param index - 当前表格命中项在全局结果中的起始索引。
   * @returns 无显式返回值；会直接改写单元格 DOM。
   * @throws 当前函数不主动抛错；非法正则仍沿用 `new RegExp()` 的运行时行为。
   * @remarks 表格文本直接用 innerHTML replace 包裹 mark，和普通富文本的 Text 节点切分路径不同。
   */
  const highlightTableText = (nodes: NodeListOf<Element>, index: number) => {
    // 遍历每个单元格文本节点。
    for (const node of nodes) {
      // 把匹配内容替换为 mark 标签，并递增全局结果索引。
      node.innerHTML = node.innerHTML.replace(new RegExp(searchWord.value, modifiers.value), () => {
        return `<mark data-index=${index++}>${searchWord.value}</mark>`
      })
    }
  }
  
  /**
   * 清除当前页面上的搜索高亮 mark。
   *
   * @returns 无显式返回值；会直接还原 DOM。
   * @throws 当前函数不主动抛错。
   * @remarks 使用 setTimeout 推迟执行，避免和当前渲染/高亮流程在同一轮 DOM 操作中互相覆盖。
   */
  const clearMarks = () => {
    // 查找编辑区中所有搜索 mark。
    const markNodes = document.querySelectorAll('.editable-element mark')
    // 逐个还原 mark。
    for (const mark of markNodes) {
      // 延迟到当前调用栈后执行 DOM 替换。
      setTimeout(() => {
        // mark 父节点。
        const parentNode = mark.parentNode!
        // mark 中的纯文本。
        const text = mark.textContent!
        // 用普通 Text 节点替换 mark，恢复原 DOM 结构。
        parentNode.replaceChild(document.createTextNode(text), mark)
      }, 0)
    }
  }
  
  /**
   * 高亮当前幻灯片中可见的搜索结果。
   *
   * @returns 无显式返回值；会直接改写当前页 DOM。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - 只处理当前页的搜索结果，跨页结果在切页后由 watch(slideIndex) 再高亮。
   * - 同一元素多次命中时只对该元素执行一次高亮，避免重复插入 mark。
   */
  const highlightCurrentSlide = () => {
    // 先清除旧高亮，避免重复包裹 mark。
    clearMarks()
    
    // 等待当前页 DOM 渲染稳定后再插入高亮。
    setTimeout(() => {
      // 遍历全部搜索结果，筛选当前页结果。
      for (let i = 0; i < searchResults.value.length; i++) {
        // 上一个结果，用于判断同一元素是否已经处理过。
        const lastTarget = searchResults.value[i - 1]
        // 当前结果。
        const target = searchResults.value[i]
        // 非当前页结果跳过。
        if (target.slideId !== currentSlide.value.id) continue
        // 同一元素上一条已经高亮过时跳过，避免重复扫描同一 DOM。
        if (lastTarget && lastTarget.elId === target.elId) continue
  
        // 通过元素 ID 找到编辑区 DOM。
        const node = document.querySelector(`#editable-element-${target.elId}`)
        // DOM 存在时才尝试高亮。
        if (node) {
          // 表格使用单元格文本节点高亮。
          if (target.elType === 'table') {
            // 找到表格内所有单元格文本容器。
            const cells = node.querySelectorAll('.cell-text')
            // 高亮表格文本。
            highlightTableText(cells, i)
          }
          // 普通文本和形状文本使用 Text 节点切分高亮。
          else {
            // 获取元素内所有文本节点。
            const textNodes = getTextNodeList(node)
            // 计算文本节点对应的整体文本区间。
            const textList = getTextInfoList(textNodes)
            // 拼接成完整纯文本，便于用统一正则计算匹配位置。
            const content = textList.map(({ text }) => text).join('')
            // 计算所有匹配。
            const matchList = getMatchList(content, searchWord.value)
            // 插入 mark 高亮。
            highlight(textNodes, textList, matchList, i)
          }
        }
      }
    }, 0)
  }
  
  /**
   * 根据当前 searchIndex 设置活动高亮项。
   *
   * @returns 无显式返回值；会修改 mark 的 class。
   * @throws 当前函数不主动抛错。
   * @remarks active class 用于视觉上标出当前正在跳转或替换的命中项。
   */
  const setActiveMark = () => {
    // 查找所有带 data-index 的高亮 mark。
    const markNodes = document.querySelectorAll('mark[data-index]')
    // 遍历 mark 并切换 active class。
    for (const node of markNodes) {
      // 延迟到 DOM 高亮完成后再设置 active。
      setTimeout(() => {
        // 读取 mark 对应的全局搜索结果索引。
        const index = (node as HTMLElement).dataset.index
        // 当前索引命中时添加 active。
        if (index !== undefined && +index === searchIndex.value) {
          node.classList.add('active')
        }
        // 其他 mark 移除 active。
        else node.classList.remove('active')
      }, 0)
    }
  }
  
  /**
   * 跳转到当前 searchIndex 指向的搜索结果。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 当前结果在本页时只更新 active mark；跨页时先切换幻灯片，再由 slideIndex watcher 负责高亮。
   */
  const turnTarget = () => {
    // 没有有效搜索索引时不处理。
    if (searchIndex.value === -1) return
    
    // 当前搜索目标。
    const target = searchResults.value[searchIndex.value]
  
    // 目标在当前页时直接激活对应 mark。
    if (target.slideId === currentSlide.value.id) setTimeout(setActiveMark, 0)
    // 目标在其他页时先切换页面。
    else {
      // 查找目标页索引。
      const index = slides.value.findIndex(slide => slide.id === target.slideId)
      // 找到目标页后切换过去。
      if (index !== -1) slidesStore.updateSlideIndex(index)
    }
  }
  
  /**
   * 跳转到下一条搜索结果。
   *
   * @returns 无显式返回值；无搜索词时会提示用户。
   * @throws 若搜索词不是合法正则，首次 search 时可能抛出异常；当前保持原逻辑。
   * @remarks 到达最后一条后会循环回第一条。
   */
  const searchNext = () => {
    // 空搜索词直接提示。
    if (!searchWord.value) return message.warning('请先输入查找内容')
    // 搜索跳转前清空当前元素选区，避免选区视觉干扰搜索高亮。
    mainStore.setActiveElementIdList([])
    // 尚未搜索时先执行搜索。
    if (searchIndex.value === -1) search()
    // 未到最后一条时前进一条。
    else if (searchIndex.value < searchResults.value.length - 1) searchIndex.value += 1
    // 到达最后一条后回到第一条。
    else searchIndex.value = 0
    // 跳转到目标结果。
    turnTarget()
  }
  
  /**
   * 跳转到上一条搜索结果。
   *
   * @returns 无显式返回值；无搜索词时会提示用户。
   * @throws 若搜索词不是合法正则，首次 search 时可能抛出异常；当前保持原逻辑。
   * @remarks 到达第一条后会循环到最后一条。
   */
  const searchPrev = () => {
    // 空搜索词直接提示。
    if (!searchWord.value) return message.warning('请先输入查找内容')
    // 搜索跳转前清空当前元素选区。
    mainStore.setActiveElementIdList([])
    // 尚未搜索时先执行搜索。
    if (searchIndex.value === -1) search()
    // 未到第一条时后退一条。
    else if (searchIndex.value > 0) searchIndex.value -= 1
    // 到达第一条后跳到最后一条。
    else searchIndex.value = searchResults.value.length - 1
    // 跳转到目标结果。
    turnTarget()
  }
  
  /**
   * 替换当前活动搜索结果。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错；DOM 查询失败时直接返回。
   * @remarks
   * - 只替换当前 active mark 对应的一处命中。
   * - 替换后会从结果列表中移除当前项，并重新高亮当前页。
   */
  const replace = () => {
    // 空搜索词不处理。
    if (!searchWord.value) return
    // 尚未定位结果时先跳到下一条。
    if (searchIndex.value === -1) {
      searchNext()
      return
    }
  
    // 当前待替换目标。
    const target = searchResults.value[searchIndex.value]
    // 当前目标 DOM。
    let targetElement = null
    // 表格需要定位到具体单元格。
    if (target.elType === 'table') {
      // 读取目标单元格坐标。
      const [i, j] = target.cellIndex
      // 查询目标单元格文本容器。
      targetElement = document.querySelector(`#editable-element-${target.elId} .cell[data-cell-index="${i}_${j}"] .cell-text`)
    }
    // 普通文本和形状文本定位到 ProseMirror 容器。
    else targetElement = document.querySelector(`#editable-element-${target.elId} .ProseMirror`)
    // 当前页 DOM 中找不到目标时终止。
    if (!targetElement) return
  
    // 创建离线 DOM，避免直接在真实编辑 DOM 上做替换。
    const fakeElement = document.createElement('div')
    // 复制当前目标 DOM 的 HTML，里面包含搜索 mark。
    fakeElement.innerHTML = targetElement.innerHTML
  
    // 标记是否已经替换过当前 active 项。
    let replaced = false
    // 找到所有搜索 mark。
    const marks = fakeElement.querySelectorAll('mark[data-index]')
    // 遍历 mark，并把非 active mark 还原为普通文本。
    for (const mark of marks) {
      // 当前 mark 父节点。
      const parentNode = mark.parentNode!
      // active mark 是当前要替换的命中。
      if (mark.classList.contains('active')) {
        // 如果同一匹配被拆成多个 mark，后续片段删除，避免替换成多份文本。
        if (replaced) parentNode.removeChild(mark)
        // 第一段 active mark 替换为替换词。
        else {
          parentNode.replaceChild(document.createTextNode(replaceWord.value), mark)
          replaced = true
        }
      }
      // 非 active mark 只还原文本，不参与替换。
      else {
        // 原命中文本。
        const text = mark.textContent!
        // 还原为普通 Text 节点。
        parentNode.replaceChild(document.createTextNode(text), mark)
      }
    }
  
    // 写回普通文本元素内容。
    if (target.elType === 'text') {
      // 新文本 HTML。
      const props = { content: fakeElement.innerHTML }
      // 更新元素。
      slidesStore.updateElement({ id: target.elId, props })
    }
    // 写回形状内文本。
    else if (target.elType === 'shape') {
      // 查找当前页目标形状。
      const el = currentSlide.value.elements.find(item => item.id === target.elId)
      // 只有带 text 的形状才可写回。
      if (el && el.type === 'shape' && el.text) {
        // 保留原 text 配置，只替换 content。
        const props = { text: { ...el.text, content: fakeElement.innerHTML } }
        // 更新元素。
        slidesStore.updateElement({ id: target.elId, props })
      }
    }
    // 写回表格单元格文本。
    else if (target.elType === 'table') {
      // 查找当前页目标表格。
      const el = currentSlide.value.elements.find(item => item.id === target.elId)
      // 只有表格元素才可写回。
      if (el && el.type === 'table') {
        // 复制表格数据并替换目标单元格。
        const data = el.data.map((row, i) => {
          // 只处理目标行。
          if (i === target.cellIndex[0]) {
            // 复制目标行单元格。
            return row.map((cell, j) => {
              // 只替换目标列。
              if (j === target.cellIndex[1]) {
                return {
                  // 保留单元格其他属性。
                  ...cell,
                  // 写入替换后的 HTML。
                  text: fakeElement.innerHTML,
                }
              }
              // 非目标单元格保持不变。
              return cell
            })
          }
          // 非目标行保持不变。
          return row
        })
        // 表格更新数据。
        const props = { data }
        // 更新元素。
        slidesStore.updateElement({ id: target.elId, props })
      }
    }
  
    // 当前命中已被替换，从结果列表移除。
    searchResults.value.splice(searchIndex.value, 1)
    // 还有剩余结果时重新定位。
    if (searchResults.value.length) {
      // 如果当前索引越界，则回到第一条。
      if (searchIndex.value > searchResults.value.length - 1) {
        searchIndex.value = 0
      }
      // 等待数据写回和 DOM 更新后重新高亮并定位。
      nextTick(() => {
        highlightCurrentSlide()
        turnTarget()
      })
    }
    // 没有剩余结果时重置索引。
    else searchIndex.value = -1
  }
  
  /**
   * 替换当前搜索结果中的全部命中。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错；非法正则沿用现有运行时行为。
   * @remarks
   * - 同一元素可能有多条 searchResults，本函数会按元素去重处理，避免同一元素被重复替换。
   * - 表格直接对单元格文本执行正则替换；普通文本/形状文本会先插入 mark，再按 mark 去重替换。
   */
  const replaceAll = () => {
    // 空搜索词不处理。
    if (!searchWord.value) return
    // 尚未搜索时先触发一次搜索定位。
    if (searchIndex.value === -1) {
      searchNext()
      return
    }
  
    // 遍历当前全部搜索结果。
    for (let i = 0; i < searchResults.value.length; i++) {
      // 上一个结果，用于同元素去重。
      const lastTarget = searchResults.value[i - 1]
      // 当前结果。
      const target = searchResults.value[i]
      // 同一元素已经处理过时跳过，避免重复替换。
      if (lastTarget && lastTarget.elId === target.elId) continue
  
      // 查找目标幻灯片。
      const targetSlide = slides.value.find(item => item.id === target.slideId)
      // 页面不存在时跳过。
      if (!targetSlide) continue
      // 查找目标元素。
      const targetElement = targetSlide.elements.find(item => item.id === target.elId)
      // 元素不存在时跳过。
      if (!targetElement) continue
  
      // 离线 DOM，用于普通文本和形状文本替换。
      const fakeElement = document.createElement('div')
      // 普通文本写入原 HTML。
      if (targetElement.type === 'text') fakeElement.innerHTML = targetElement.content
      // 形状文本写入形状 text HTML。
      else if (targetElement.type === 'shape') fakeElement.innerHTML = targetElement.text?.content || ''
  
      // 表格走单元格文本替换路径。
      if (target.elType === 'table') {
        // 复制表格数据并替换每个单元格内的匹配文本。
        const data = (targetElement as PPTTableElement).data.map(row => {
          // 复制当前行。
          return row.map(cell => {
            // 空文本单元格保持不变。
            if (!cell.text) return cell
            // 返回替换后的单元格。
            return {
              // 保留单元格其他配置。
              ...cell,
              // 替换当前单元格中的全部命中；沿用既有逻辑使用 g，不受 modifiers 的 i 影响。
              text: cell.text.replace(new RegExp(searchWord.value, 'g'), replaceWord.value),
            }
          })
        })
        // 表格更新数据。
        const props = { data }
        // 写回指定页面上的目标表格。
        slidesStore.updateElement({ id: target.elId, slideId: target.slideId, props })
      }
      // 普通文本和形状文本走 mark 去重替换路径。
      else {
        // 获取离线 DOM 中的文本节点。
        const textNodes = getTextNodeList(fakeElement)
        // 计算文本节点区间。
        const textList = getTextInfoList(textNodes)
        // 拼接完整纯文本。
        const content = textList.map(({ text }) => text).join('')
        // 计算全部匹配。
        const matchList = getMatchList(content, searchWord.value)
        // 在离线 DOM 中插入 mark。
        highlight(textNodes, textList, matchList, i)
  
        // 获取离线 DOM 中的 mark。
        const marks = fakeElement.querySelectorAll('mark[data-index]')
        // 记录上一段 mark 的索引，用于处理跨 Text 节点的同一匹配。
        let lastMarkIndex = -1
        // 遍历 mark，替换每个唯一命中。
        for (const mark of marks) {
          // 当前 mark 对应的全局命中索引。
          const markIndex = +(mark as HTMLElement).dataset.index!
          // 当前 mark 父节点。
          const parentNode = mark.parentNode!
          // 同一命中的后续拆分片段删除，避免重复替换。
          if (markIndex === lastMarkIndex) parentNode.removeChild(mark)
          // 新命中的第一段替换为替换词。
          else {
            parentNode.replaceChild(document.createTextNode(replaceWord.value), mark)
            lastMarkIndex = markIndex
          }
        }
  
        // 写回普通文本元素。
        if (target.elType === 'text') {
          // 替换后的 HTML。
          const props = { content: fakeElement.innerHTML }
          // 更新指定页面上的目标元素。
          slidesStore.updateElement({ id: target.elId, slideId: target.slideId, props })
        }
        // 写回形状内文本。
        else if (target.elType === 'shape') {
          // 查找当前页目标形状；注意这里沿用现有逻辑使用 currentSlide。
          const el = currentSlide.value.elements.find(item => item.id === target.elId)
          // 只有带文本的形状才可更新。
          if (el && el.type === 'shape' && el.text) {
            // 保留形状文本其他配置，只替换 content。
            const props = { text: { ...el.text, content: fakeElement.innerHTML } }
            // 更新指定页面上的目标形状。
            slidesStore.updateElement({ id: target.elId, slideId: target.slideId, props })
          }
        }
      }
    }
    // 全部替换后清空搜索结果。
    searchResults.value = []
    // 重置当前索引。
    searchIndex.value = -1
  }

  /**
   * 重置搜索定位状态。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 搜索词清空时同步清理页面高亮；搜索词变化但非空时保留 DOM 清理由后续搜索触发。
   */
  const reset = () => {
    // 重置当前命中索引。
    searchIndex.value = -1
    // 清空搜索结果。
    searchResults.value = []
  
    // 搜索词为空时清除高亮。
    if (!searchWord.value) clearMarks()
  }
  
  // 搜索词变化时重置搜索结果。
  watch(searchWord, reset)
  
  // 切换幻灯片后重新高亮当前页，并激活当前命中项。
  watch(slideIndex, () => {
    // 等待页面 DOM 根据新 slideIndex 渲染完成。
    nextTick(() => {
      // 高亮当前页命中。
      highlightCurrentSlide()
      // 延迟设置 active，确保 mark 已经插入 DOM。
      setTimeout(setActiveMark, 0)
    })
  })
  
  // 当前操作元素变化时，说明用户进入编辑/选择状态，需要清理搜索高亮。
  watch(handleElement, () => {
    // 存在操作元素时清空搜索状态。
    if (handleElement.value) {
      // 重置索引。
      searchIndex.value = -1
      // 清空结果。
      searchResults.value = []
      // 清理 DOM mark。
      clearMarks()
    }
  })
  
  // 组件卸载前清理 mark，避免搜索面板销毁后页面上残留高亮。
  onBeforeUnmount(clearMarks)
  
  /**
   * 切换搜索大小写模式。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 在区分大小写 `g` 和忽略大小写 `gi` 之间切换，并清空当前搜索结果。
   */
  const toggleModifiers = () => {
    // g 与 gi 互切。
    modifiers.value = modifiers.value === 'g' ? 'gi' : 'g'
    // 模式变化后旧结果不再可靠，需要重置。
    reset()
  }

  // 暴露搜索面板所需状态和操作函数。
  return {
    // 查找关键词。
    searchWord,
    // 替换文本。
    replaceWord,
    // 搜索结果列表。
    searchResults,
    // 当前命中索引。
    searchIndex,
    // 当前正则修饰符。
    modifiers,
    // 查找下一处。
    searchNext,
    // 查找上一处。
    searchPrev,
    // 替换当前处。
    replace,
    // 替换全部。
    replaceAll,
    // 切换大小写敏感模式。
    toggleModifiers,
  }
}
