import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useMainStore, useSlidesStore } from '@/store'
import { getImageSize } from '@/utils/image'
import type { PPTLineElement, PPTElement, TableCell, TableCellStyle, PPTShapeElement, ChartType, PPTVideoElement, PPTAudioElement } from '@/types/slides'
import { type ShapePoolItem, SHAPE_PATH_FORMULAS } from '@/configs/shapes'
import type { LinePoolItem } from '@/configs/lines'
import { CHART_DEFAULT_DATA } from '@/configs/chart'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

/**
 * 矩形类元素创建时的位置和尺寸信息。
 *
 * @property top - 元素左上角 y 坐标。
 * @property left - 元素左上角 x 坐标。
 * @property width - 元素宽度。
 * @property height - 元素高度。
 * @remarks 适用于文本、形状等通过外接矩形定位的元素。
 */
interface CommonElementPosition {
  top: number
  left: number
  width: number
  height: number
}

/**
 * 线条元素创建时的位置和端点信息。
 *
 * @property top - 线条元素局部坐标系对应的画布 y 坐标。
 * @property left - 线条元素局部坐标系对应的画布 x 坐标。
 * @property start - 线条起点在元素局部坐标系中的坐标。
 * @property end - 线条终点在元素局部坐标系中的坐标。
 * @remarks 线条元素通过 left/top 加局部 start/end 建模，而不是直接用绝对点位。
 */
interface LineElementPosition {
  top: number
  left: number
  start: [number, number]
  end: [number, number]
}

/**
 * 创建文本元素时的可选补充数据。
 *
 * @property content - 初始富文本 HTML 内容。
 * @property vertical - 是否创建竖排文本。
 */
interface CreateTextData {
  content?: string
  vertical?: boolean
}

/**
 * 提供各种 PPT 元素的创建工厂方法。
 *
 * @returns 包含图片、图表、表格、文本、形状、线条、LaTeX、视频和音频创建方法的对象。
 * @throws 当前 composable 不主动抛错；图片读取、ID 生成、DOM 查询、store 更新或历史快照写入异常会按对应运行时行为表现。
 * @remarks
 * - 所有元素最终都通过内部 `createElement()` 插入当前页，并设置为选中状态。
 * - 大多数默认元素会根据当前画布尺寸居中放置。
 * - 新元素会使用当前主题字体、主题色、描边等配置作为初始样式。
 */
export default () => {
  // 获取主状态 store，用于读取创建状态、设置选中元素和恢复编辑区焦点。
  const mainStore = useMainStore()
  // 获取幻灯片 store，用于新增元素并读取主题/画布配置。
  const slidesStore = useSlidesStore()
  // 当前是否处于画布拖拽创建元素状态。
  const { creatingElement } = storeToRefs(mainStore)
  // 当前主题、画布比例和画布宽度基准。
  const { theme, viewportRatio, viewportSize } = storeToRefs(slidesStore)

  // 获取历史快照写入方法，用于创建元素后记录撤销点。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 创建并插入一个元素，然后将其设置为当前选中元素。
   *
   * @param element - 完整 PPT 元素数据。
   * @param callback - 元素插入和焦点恢复调度后执行的可选回调。
   * @returns 无显式返回值。
   * @throws store 更新、回调执行或历史快照写入异常会向上表现为运行时错误。
   * @remarks
   * - 该函数是所有具体创建方法的统一出口。
   * - 如果当前处于 creatingElement 状态，插入后会清空该状态。
   * - 使用 setTimeout 恢复编辑区焦点，等待 DOM 和 Vue 更新完成。
   */
  const createElement = (element: PPTElement, callback?: () => void) => {
    // 将新元素追加到当前幻灯片。
    slidesStore.addElement(element)
    // 将新元素设置为唯一选中元素。
    mainStore.setActiveElementIdList([element.id])

    // 如果创建来源是画布拖拽创建状态，则插入后清空该状态。
    if (creatingElement.value) mainStore.setCreatingElement(null)

    // 等待 DOM 更新后恢复编辑区焦点，保证后续快捷键仍作用于编辑器。
    setTimeout(() => {
      mainStore.setEditorareaFocus(true)
    }, 0)

    // 如果调用方提供后续处理，则在元素创建后执行。
    if (callback) callback()

    // 记录历史快照，支持撤销创建操作。
    addHistorySnapshot()
  }

  /**
   * 创建图片元素。
   *
   * @param src - 图片地址，可以是远程 URL、Data URL 或 Blob URL。
   * @returns 无显式返回值。
   * @throws 图片尺寸读取异常会按 `getImageSize()` 的行为表现；ID 生成或 store 更新异常会向上表现为运行时错误。
   * @remarks
   * - 会先读取图片尺寸，再按画布大小等比缩放，避免图片超过画布。
   * - 创建后的图片固定宽高比并居中放置。
   */
  const createImageElement = (src: string) => {
    // 异步获取图片在浏览器中的尺寸。
    getImageSize(src).then(({ width, height }) => {
      // 计算图片高宽比。
      const scale = height / width
  
      // 图片比画布更宽且横向超出时，按画布宽度缩放。
      if (scale < viewportRatio.value && width > viewportSize.value) {
        width = viewportSize.value
        height = width * scale
      }
      // 图片高度超出画布时，按画布高度缩放。
      else if (height > viewportSize.value * viewportRatio.value) {
        height = viewportSize.value * viewportRatio.value
        width = height / scale
      }

      // 构造图片元素并插入画布。
      createElement({
        type: 'image',
        id: nanoid(10),
        src,
        width,
        height,
        left: (viewportSize.value - width) / 2,
        top: (viewportSize.value * viewportRatio.value - height) / 2,
        fixedRatio: true,
        rotate: 0,
      })
    })
  }
  
  /**
   * 创建图表元素。
   *
   * @param type - 图表类型。
   * @returns 无显式返回值。
   * @throws ID 生成、默认数据读取或 store 更新异常会向上表现为运行时错误。
   * @remarks 图表会使用当前主题色和字体色，并加载对应类型的默认数据。
   */
  const createChartElement = (type: ChartType) => {
    // 构造默认图表元素，使用固定尺寸和当前主题配色。
    createElement({
      type: 'chart',
      id: nanoid(10),
      chartType: type,
      left: 300,
      top: 81.25,
      width: 400,
      height: 400,
      rotate: 0,
      themeColors: theme.value.themeColors,
      textColor: theme.value.fontColor,
      data: CHART_DEFAULT_DATA[type],
    })
  }
  
  /**
   * 创建表格元素。
   *
   * @param row - 表格行数。
   * @param col - 表格列数。
   * @returns 无显式返回值。
   * @throws 行列数非法、ID 生成或 store 更新异常会向上表现为运行时错误。
   * @remarks
   * - 每个单元格都会生成独立 ID。
   * - 默认单元格样式使用当前主题字体和字体颜色。
   * - 表格默认居中插入画布。
   */
  const createTableElement = (row: number, col: number) => {
    // 定义单元格默认文本样式，沿用当前主题字体和颜色。
    const style: TableCellStyle = {
      fontname: theme.value.fontName,
      color: theme.value.fontColor,
    }
    // 初始化二维表格数据。
    const data: TableCell[][] = []
    // 按行创建表格单元格。
    for (let i = 0; i < row; i++) {
      // 当前行的单元格数组。
      const rowCells: TableCell[] = []
      // 按列创建单元格。
      for (let j = 0; j < col; j++) {
        // 创建默认单元格，初始不合并、文本为空。
        rowCells.push({ id: nanoid(10), colspan: 1, rowspan: 1, text: '', style })
      }
      // 将当前行加入表格数据。
      data.push(rowCells)
    }

    // 默认单元格宽度，用于计算初始表格总宽。
    const DEFAULT_CELL_WIDTH = 100
    // 默认单元格高度，用于计算初始表格总高。
    const DEFAULT_CELL_HEIGHT = 36

    // 初始化每列宽度占比，默认所有列等宽。
    const colWidths: number[] = new Array(col).fill(1 / col)

    // 根据列数计算表格宽度。
    const width = col * DEFAULT_CELL_WIDTH
    // 根据行数计算表格高度。
    const height = row * DEFAULT_CELL_HEIGHT

    // 构造表格元素并插入画布。
    createElement({
      type: 'table',
      id: nanoid(10),
      width,
      height,
      colWidths,
      rotate: 0,
      data,
      left: (viewportSize.value - width) / 2,
      top: (viewportSize.value * viewportRatio.value - height) / 2,
      outline: {
        width: 2,
        style: 'solid',
        color: '#eeece1',
      },
      theme: {
        color: theme.value.themeColors[0],
        rowHeader: true,
        rowFooter: false,
        colHeader: false,
        colFooter: false,
      },
      cellMinHeight: 36,
    })
  }
  
  /**
   * 创建文本元素。
   *
   * @param position - 文本框位置和尺寸信息。
   * @param data - 文本初始内容和排版方向。
   * @returns 无显式返回值。
   * @throws ID 生成、DOM 查询或 store 更新异常会向上表现为运行时错误。
   * @remarks 创建后会尝试聚焦对应 ProseMirror 编辑器，使用户可以直接输入。
   */
  const createTextElement = (position: CommonElementPosition, data?: CreateTextData) => {
    // 解构文本框位置和尺寸。
    const { left, top, width, height } = position
    // 初始文本内容，缺省为空字符串。
    const content = data?.content || ''
    // 是否竖排文本，缺省为 false。
    const vertical = data?.vertical || false

    // 生成文本元素 ID，稍后用于定位对应 DOM 编辑器。
    const id = nanoid(10)
    // 构造文本元素并插入画布。
    createElement({
      type: 'text',
      id,
      left, 
      top, 
      width, 
      height,
      content,
      rotate: 0,
      defaultFontName: theme.value.fontName,
      defaultColor: theme.value.fontColor,
      vertical,
    }, () => {
      // 等待文本元素和 ProseMirror DOM 渲染完成后聚焦。
      setTimeout(() => {
        // 根据元素 ID 查找内部 ProseMirror 编辑区域。
        const editorRef: HTMLElement | null = document.querySelector(`#editable-element-${id} .ProseMirror`)
        // 找到编辑器时直接聚焦，减少用户创建文本后的额外点击。
        if (editorRef) editorRef.focus()
      }, 0)
    })
  }
  
  /**
   * 创建形状元素。
   *
   * @param position - 形状位置和尺寸信息。
   * @param data - 形状池配置项，包含路径、viewBox、边框和特殊公式信息。
   * @param supplement - 需要额外覆盖或补充到形状元素上的字段。
   * @returns 无显式返回值。
   * @throws ID 生成、路径公式执行或 store 更新异常会向上表现为运行时错误。
   * @remarks
   * - 普通形状直接使用配置中的 path/viewBox。
   * - 公式形状会根据当前宽高重新计算 path，并可能生成可编辑关键点。
   */
  const createShapeElement = (position: CommonElementPosition, data: ShapePoolItem, supplement: Partial<PPTShapeElement> = {}) => {
    // 解构形状位置和尺寸。
    const { left, top, width, height } = position
    // 构造基础形状元素。
    const newElement: PPTShapeElement = {
      type: 'shape',
      id: nanoid(10),
      left, 
      top, 
      width, 
      height,
      viewBox: data.viewBox,
      path: data.path,
      fill: theme.value.themeColors[0],
      fixedRatio: false,
      rotate: 0,
      ...supplement,
    }
    // 配置要求带边框时，使用当前主题描边作为默认轮廓。
    if (data.withborder) newElement.outline = theme.value.outline
    // 特殊形状写入 special 标记，供后续渲染或编辑逻辑识别。
    if (data.special) newElement.special = true
    // 如果形状使用路径公式，则根据当前尺寸动态生成 path。
    if (data.pathFormula) {
      // 保存公式标识，便于后续缩放或关键点编辑时重新计算。
      newElement.pathFormula = data.pathFormula
      // 公式形状 viewBox 使用实际元素尺寸。
      newElement.viewBox = [width, height]

      // 读取对应路径公式配置。
      const pathFormula = SHAPE_PATH_FORMULAS[data.pathFormula]
      // 可编辑公式形状需要使用默认关键点生成初始路径。
      if ('editable' in pathFormula && pathFormula.editable) {
        // 根据默认关键点和当前尺寸生成路径。
        newElement.path = pathFormula.formula(width, height, pathFormula.defaultValue!)
        // 保存关键点默认值，供用户后续拖拽调整。
        newElement.keypoints = pathFormula.defaultValue
      }
      // 不可编辑公式形状直接根据宽高生成路径。
      else newElement.path = pathFormula.formula(width, height)
    }
    // 插入形状元素。
    createElement(newElement)
  }
  
  /**
   * 创建线条元素。
   *
   * @param position - 线条位置和起止点信息。
   * @param data - 线条池配置项，包含端点、线型和路径类型。
   * @returns 无显式返回值。
   * @throws ID 生成或 store 更新异常会向上表现为运行时错误。
   * @remarks
   * - 折线、双折线、二次曲线和三次曲线都会在起终点中点初始化控制点。
   * - 线条颜色默认使用当前主题色第一项。
   */
  const createLineElement = (position: LineElementPosition, data: LinePoolItem) => {
    // 解构线条局部坐标系位置和起止点。
    const { left, top, start, end } = position

    // 构造基础线条元素。
    const newElement: PPTLineElement = {
      type: 'line',
      id: nanoid(10),
      left, 
      top, 
      start,
      end,
      points: data.points,
      color: theme.value.themeColors[0],
      style: data.style,
      width: 2,
    }
    // 单折线使用起终点中点作为初始折点。
    if (data.isBroken) newElement.broken = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
    // 双折线使用起终点中点作为初始控制点。
    if (data.isBroken2) newElement.broken2 = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
    // 二次贝塞尔曲线使用起终点中点作为初始控制点。
    if (data.isCurve) newElement.curve = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
    // 三次贝塞尔曲线使用两个相同的中点作为初始控制点。
    if (data.isCubic) newElement.cubic = [[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2], [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]]
    // 插入线条元素。
    createElement(newElement)
  }
  
  /**
   * 创建 LaTeX 公式元素。
   *
   * @param data - LaTeX 渲染结果数据，包含 SVG path、原始公式和尺寸。
   * @returns 无显式返回值。
   * @throws ID 生成或 store 更新异常会向上表现为运行时错误。
   * @remarks 公式元素默认固定宽高比，并根据当前画布尺寸居中放置。
   */
  const createLatexElement = (data: { path: string; latex: string; w: number; h: number; }) => {
    // 构造 LaTeX 元素并插入画布。
    createElement({
      type: 'latex',
      id: nanoid(10),
      width: data.w,
      height: data.h,
      rotate: 0,
      left: (viewportSize.value - data.w) / 2,
      top: (viewportSize.value * viewportRatio.value - data.h) / 2,
      path: data.path,
      latex: data.latex,
      color: theme.value.fontColor,
      strokeWidth: 2,
      viewBox: [data.w, data.h],
      fixedRatio: true,
    })
  }
  
  /**
   * 创建视频元素。
   *
   * @param src - 视频资源地址。
   * @param ext - 可选视频扩展名或格式标识。
   * @returns 无显式返回值。
   * @throws ID 生成或 store 更新异常会向上表现为运行时错误。
   * @remarks 视频元素默认 500x300 居中放置，且默认不自动播放。
   */
  const createVideoElement = (src: string, ext?: string) => {
    // 构造基础视频元素。
    const newElement: PPTVideoElement = {
      type: 'video',
      id: nanoid(10),
      width: 500,
      height: 300,
      rotate: 0,
      left: (viewportSize.value - 500) / 2,
      top: (viewportSize.value * viewportRatio.value - 300) / 2,
      src,
      autoplay: false,
    }
    // 如果调用方提供扩展名，则写入元素数据，供播放器或导出逻辑识别。
    if (ext) newElement.ext = ext
    // 插入视频元素。
    createElement(newElement)
  }
  
  /**
   * 创建音频元素。
   *
   * @param src - 音频资源地址。
   * @param ext - 可选音频扩展名或格式标识。
   * @returns 无显式返回值。
   * @throws ID 生成或 store 更新异常会向上表现为运行时错误。
   * @remarks 音频元素默认以 50x50 控件形式居中放置，默认不循环、不自动播放。
   */
  const createAudioElement = (src: string, ext?: string) => {
    // 构造基础音频元素。
    const newElement: PPTAudioElement = {
      type: 'audio',
      id: nanoid(10),
      width: 50,
      height: 50,
      rotate: 0,
      left: (viewportSize.value - 50) / 2,
      top: (viewportSize.value * viewportRatio.value - 50) / 2,
      loop: false,
      autoplay: false,
      fixedRatio: true,
      color: theme.value.themeColors[0],
      src,
    }
    // 如果调用方提供扩展名，则写入元素数据，供播放器或导出逻辑识别。
    if (ext) newElement.ext = ext
    // 插入音频元素。
    createElement(newElement)
  }

  // 返回所有元素创建工厂方法。
  return {
    createImageElement,
    createChartElement,
    createTableElement,
    createTextElement,
    createShapeElement,
    createLineElement,
    createLatexElement,
    createVideoElement,
    createAudioElement,
  }
}
