import tinycolor from 'tinycolor2'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { Slide } from '@/types/slides'
import type { PresetTheme } from '@/configs/theme'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import { getLineElementLength } from '@/utils/element'

/**
 * 带面积权重的主题值。
 *
 * @property area - 该值在页面中估算占用的视觉面积或权重。
 * @property value - 颜色值或字体名称。
 * @remarks 面积越大，后续排序时优先级越高，用于推断页面主要颜色或主要字体。
 */
interface ThemeValueWithArea {
  area: number
  value: string
}

/**
 * 提供幻灯片主题提取、主题应用和全局字体应用能力。
 *
 * @returns 包含主题样式提取、预置主题应用、当前主题应用到全部页面、统一字体的方法集合。
 * @throws 当前 composable 不主动抛错；JSON 深拷贝、颜色解析、store 更新或历史快照写入异常会按运行时错误表现。
 * @remarks
 * - 主题提取通过元素外接面积估算颜色和字体的重要程度。
 * - 应用主题会改写页面背景、元素填充色、文本默认色、图表色、线条色、描边和阴影等字段。
 * - 富文本内联颜色和字体会被移除，让元素回到主题默认样式控制。
 */
export default () => {
  // 获取幻灯片 store，用于读取全部页面和当前主题，并写回主题/页面数据。
  const slidesStore = useSlidesStore()
  // 全部幻灯片列表和当前全局主题。
  const { slides, theme } = storeToRefs(slidesStore)

  // 获取历史快照写入方法，用于主题批量变更后记录撤销点。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 获取指定幻灯片内的主要主题样式，并按视觉面积占比排序。
   *
   * @param slide - 单张幻灯片或幻灯片数组。
   * @returns 背景色、主题色、字体颜色、字体名称四类排序结果。
   * @throws 颜色解析或元素数据异常会按运行时行为表现。
   * @remarks
   * - 背景色按页面为单位统计，渐变背景会把每个色标平均分摊权重。
   * - 元素主题色、字体色、字体名按元素面积加权。
   * - 富文本中的内联颜色/字体通过正则粗略提取，未覆盖部分使用元素默认样式。
   */
  const getSlidesThemeStyles = (slide: Slide | Slide[]) => {
    // 统一把入参转成数组，便于后续按多页处理。
    const slides = Array.isArray(slide) ? slide : [slide]

    // 背景色候选值，包含面积权重。
    const backgroundColorValues: ThemeValueWithArea[] = []
    // 主题色候选值，通常来自形状填充、图表主题色、线条色等。
    const themeColorValues: ThemeValueWithArea[] = []
    // 字体颜色候选值，来自文本、表格、LaTeX 等。
    const fontColorValues: ThemeValueWithArea[] = []
    // 字体名称候选值，来自文本默认字体或富文本内联字体。
    const fontNameValues: ThemeValueWithArea[] = []

    // 遍历目标幻灯片，累积各类主题候选值。
    for (const slide of slides) {
      // 先处理页面背景。
      if (slide.background) {
        // 纯色背景直接按整页权重记录。
        if (slide.background.type === 'solid' && slide.background.color) {
          backgroundColorValues.push({ area: 1, value: slide.background.color })
        }
        // 渐变背景把每个渐变色标平均分配权重。
        else if (slide.background.type === 'gradient' && slide.background.gradient) {
          // 渐变色标数量。
          const len = slide.background.gradient.colors.length
          // 将每个色标作为背景候选色记录。
          backgroundColorValues.push(...slide.background.gradient.colors.map(item => ({
            area: 1 / len,
            value: item.color,
          })))
        }
        // 图片背景或其他背景类型无法提取实际颜色时，使用当前主题背景色兜底。
        else backgroundColorValues.push({ area: 1, value: theme.value.backgroundColor })
      }
      // 遍历页面元素，按元素面积统计颜色和字体。
      for (const el of slide.elements) {
        // 元素宽度用于估算视觉面积。
        const elWidth = el.width
        // 元素高度会按元素类型计算。
        let elHeight = 0
        // 线条元素没有普通 height 语义，因此用起止点距离作为高度权重。
        if (el.type === 'line') {
          // 读取线条起点。
          const [startX, startY] = el.start
          // 读取线条终点。
          const [endX, endY] = el.end
          // 使用起止点距离估算线条视觉长度。
          elHeight = Math.sqrt(Math.pow(Math.abs(startX - endX), 2) + Math.pow(Math.abs(startY - endY), 2))
        }
        // 其他元素直接使用元素 height。
        else elHeight = el.height
  
        // 用宽度乘高度估算元素视觉面积。
        const area = elWidth * elHeight
  
        // 形状和文本可能同时拥有填充色和文本内容，需要重点提取。
        if (el.type === 'shape' || el.type === 'text') {
          // 填充色作为主题色候选值。
          if (el.fill) {
            themeColorValues.push({ area, value: el.fill })
          }
          // 形状渐变填充拆分为多个主题色候选值。
          if (el.type === 'shape' && el.gradient) {
            // 渐变色标数量。
            const len = el.gradient.colors.length
            // 每个渐变色按面积均分。
            themeColorValues.push(...el.gradient.colors.map(item => ({
              area: 1 / len * area,
              value: item.color,
            })))
          }

          // 形状文本和普通文本的内容字段不同，这里统一取出 HTML 字符串。
          const text = (el.type === 'shape' ? el.text?.content : el.content) || ''
          // 没有文本内容时跳过字体颜色和字体名称统计。
          if (!text) continue

          // 去掉 HTML 标签和空白字符，用纯文本长度估算内联样式占比。
          const plainText = text.replace(/<[^>]+>/g, '').replace(/\s*/g, '')
          // 匹配带 color 内联样式的 HTML 片段。
          const matchForColor = text.match(/<[^>]+color: .+?<\/.+?>/g)
          // 匹配带 font-family 内联样式的 HTML 片段。
          const matchForFont = text.match(/<[^>]+font-family: .+?<\/.+?>/g)
  
          // 默认颜色占比初始为 1，后续减去带内联颜色片段的文本占比。
          let defaultColorPercent = 1
          // 默认字体占比初始为 1，后续减去带内联字体片段的文本占比。
          let defaultFontPercent = 1
  
          // 如果存在内联颜色片段，则按片段文本长度估算其面积权重。
          if (matchForColor) {
            // 遍历每个带颜色样式的 HTML 片段。
            for (const item of matchForColor) {
              // 从 style 字符串中提取颜色值。
              const ret = item.match(/color: (.+?);/)
              // 无法提取颜色时跳过该片段。
              if (!ret) continue
              // 提取该片段纯文本并去除空白。
              const text = item.replace(/<[^>]+>/g, '').replace(/\s*/g, '')
              // 读取内联颜色值。
              const color = ret[1]
              // 用该片段文字长度占整段文字长度的比例估算样式占比。
              const percentage = text.length / plainText.length
              // 默认颜色占比减去内联颜色占比。
              defaultColorPercent = defaultColorPercent - percentage
              
              // 按元素面积和文本占比记录字体颜色候选。
              fontColorValues.push({
                area: area * percentage,
                value: color,
              })
            }
          }
          // 如果存在内联字体片段，则按片段文本长度估算其面积权重。
          if (matchForFont) {
            // 遍历每个带字体样式的 HTML 片段。
            for (const item of matchForFont) {
              // 从 style 字符串中提取字体名称。
              const ret = item.match(/font-family: (.+?);/)
              // 无法提取字体时跳过该片段。
              if (!ret) continue
              // 提取该片段纯文本并去除空白。
              const text = item.replace(/<[^>]+>/g, '').replace(/\s*/g, '')
              // 读取内联字体名称。
              const font = ret[1]
              // 用该片段文字长度占整段文字长度的比例估算字体占比。
              const percentage = text.length / plainText.length
              // 默认字体占比减去内联字体占比。
              defaultFontPercent = defaultFontPercent - percentage
              
              // 按元素面积和文本占比记录字体候选。
              fontNameValues.push({
                area: area * percentage,
                value: font,
              })
            }
          }
  
          // 剩余未被内联颜色覆盖的文本使用元素默认颜色。
          if (defaultColorPercent) {
            // 形状文本和普通文本默认颜色字段不同。
            const _defaultColor = el.type === 'shape' ? el.text?.defaultColor : el.defaultColor
            // 没有元素默认色时使用当前主题字体色。
            const defaultColor = _defaultColor || theme.value.fontColor
            // 记录默认字体颜色候选。
            fontColorValues.push({
              area: area * defaultColorPercent,
              value: defaultColor,
            })
          }
          // 剩余未被内联字体覆盖的文本使用元素默认字体。
          if (defaultFontPercent) {
            // 形状文本和普通文本默认字体字段不同。
            const _defaultFont = el.type === 'shape' ? el.text?.defaultFontName : el.defaultFontName
            // 没有元素默认字体时使用当前主题字体。
            const defaultFont = _defaultFont || theme.value.fontName
            // 记录默认字体候选。
            fontNameValues.push({
              area: area * defaultFontPercent,
              value: defaultFont,
            })
          }
        }
        // 表格元素按单元格背景、文本样式和表格主题色统计。
        else if (el.type === 'table') {
          // 计算单元格数量，默认表格数据至少有一行。
          const cellCount = el.data.length * el.data[0].length
          // 记录拥有自定义背景色的单元格数量。
          let cellWithFillCount = 0
          // 遍历每一行。
          for (const row of el.data) {
            // 遍历每个单元格。
            for (const cell of row) {
              // 单元格背景色作为主题色候选。
              if (cell.style?.backcolor) {
                // 记录有填充色的单元格数量，用于后续计算主题色剩余占比。
                cellWithFillCount += 1
                // 每个单元格按表格面积平均分摊权重。
                themeColorValues.push({ area: area / cellCount, value: cell.style?.backcolor })
              }
              // 有文本的单元格才统计字体相关样式。
              if (cell.text) {
                // 文本长度小于 10 时降低权重，避免短文本对主题判断影响过大。
                const percent = (cell.text.length >= 10) ? 1 : (cell.text.length / 10)
                // 单元格字体颜色作为字体色候选。
                if (cell.style?.color) {
                  fontColorValues.push({ area: area / cellCount * percent, value: cell.style?.color })
                }
                // 单元格字体名称按既有逻辑写入 fontColorValues；这里只解释现有行为，不改变逻辑。
                if (cell.style?.fontname) {
                  fontColorValues.push({ area: area / cellCount * percent, value: cell.style?.fontname })
                }
              }
            }
          }
          // 表格主题色用于填补没有自定义背景色的单元格面积。
          if (el.theme) {
            // 未被单元格背景覆盖的面积占比。
            const percent = 1 - cellWithFillCount / cellCount
            // 按剩余面积记录表格主题色。
            themeColorValues.push({ area: area * percent, value: el.theme.color })
          }
        }
        // 图表元素按填充、主主题色和调色盘颜色估算主题色。
        else if (el.type === 'chart') {
          // 图表背景填充权重较高。
          if (el.fill) {
            themeColorValues.push({ area: area * 0.6, value: el.fill })
          }
          // 第一个主题色通常是图表主色。
          if (el.themeColors[0]) {
            themeColorValues.push({ area: area * 0.3, value: el.themeColors[0] })
          }
          // 其他主题色作为辅助色，按剩余较小权重统计。
          for (const color of el.themeColors) {
            // 忽略完全透明颜色。
            if (tinycolor(color).getAlpha() !== 0) {
              themeColorValues.push({ area: area / el.themeColors.length * 0.1, value: color })
            }
          }
        }
        // 线条颜色作为主题色候选。
        else if (el.type === 'line') {
          themeColorValues.push({ area, value: el.color })
        }
        // 音频控件颜色作为主题色候选。
        else if (el.type === 'audio') {
          themeColorValues.push({ area, value: el.color })
        }
        // LaTeX 公式颜色作为字体色候选。
        else if (el.type === 'latex') {
          fontColorValues.push({ area, value: el.color })
        }
      }
    }
    
    // 汇总背景色权重，key 使用标准 rgba 字符串。
    const backgroundColors: Record<string, number> = {}
    // 遍历背景色候选值。
    for (const item of backgroundColorValues) {
      // 归一化颜色格式。
      const color = tinycolor(item.value).toRgbString()
      // 忽略完全透明颜色。
      if (color === 'rgba(0, 0, 0, 0)') continue
      // 首次出现时初始化权重。
      if (!backgroundColors[color]) backgroundColors[color] = item.area
      // 重复颜色累加权重。
      else backgroundColors[color] += item.area
    }

    // 汇总主题色权重。
    const themeColors: Record<string, number> = {}
    // 遍历主题色候选值。
    for (const item of themeColorValues) {
      // 归一化颜色格式。
      const color = tinycolor(item.value).toRgbString()
      // 忽略完全透明颜色。
      if (color === 'rgba(0, 0, 0, 0)') continue
      // 首次出现时初始化权重。
      if (!themeColors[color]) themeColors[color] = item.area
      // 重复颜色累加权重。
      else themeColors[color] += item.area
    }

    // 汇总字体颜色权重。
    const fontColors: Record<string, number> = {}
    // 遍历字体颜色候选值。
    for (const item of fontColorValues) {
      // 归一化颜色格式；注意非颜色字符串会按 tinycolor 规则解析。
      const color = tinycolor(item.value).toRgbString()
      // 忽略完全透明颜色。
      if (color === 'rgba(0, 0, 0, 0)') continue
      // 首次出现时初始化权重。
      if (!fontColors[color]) fontColors[color] = item.area
      // 重复颜色累加权重。
      else fontColors[color] += item.area
    }
  
    // 汇总字体名称权重。
    const fontNames: Record<string, number> = {}
    // 遍历字体名称候选值。
    for (const item of fontNameValues) {
      // 首次出现时初始化权重。
      if (!fontNames[item.value]) fontNames[item.value] = item.area
      // 重复字体累加权重。
      else fontNames[item.value] += item.area
    }

    // 返回按权重从高到低排序后的主题样式列表。
    return {
      backgroundColors: Object.keys(backgroundColors).sort((a, b) => backgroundColors[b] - backgroundColors[a]),
      themeColors: Object.keys(themeColors).sort((a, b) => themeColors[b] - themeColors[a]),
      fontColors: Object.keys(fontColors).sort((a, b) => fontColors[b] - fontColors[a]),
      fontNames: Object.keys(fontNames).sort((a, b) => fontNames[b] - fontNames[a]),
    }
  }

  /**
   * 获取指定幻灯片内的主要颜色，并按估算面积排序。
   *
   * @param slide - 目标幻灯片。
   * @returns 忽略透明度后的颜色列表，按面积权重从高到低排序。
   * @throws 颜色解析或元素数据异常会按运行时行为表现。
   * @remarks
   * - 该函数服务于主题替换时的颜色映射。
   * - 颜色会统一设置 alpha 为 1，因此同色不同透明度会映射到同一个基础颜色。
   */
  const getSlideAllColors = (slide: Slide) => {
    // 颜色到面积权重的映射。
    const colorMap: Record<string, number> = {}

    /**
     * 记录颜色及其面积权重。
     *
     * @param color - 原始颜色值。
     * @param area - 该颜色估算面积。
     * @returns 无显式返回值。
     * @throws tinycolor 解析异常会按运行时行为表现。
     * @remarks 记录前会把 alpha 统一设置为 1，便于主题颜色映射。
     */
    const record = (color: string, area: number) => {
      // 归一化为不透明 rgba 字符串。
      const _color = tinycolor(color).setAlpha(1).toRgbString()
      // 首次出现时初始化权重。
      if (!colorMap[_color]) colorMap[_color] = area
      // 重复颜色累加权重。
      else colorMap[_color] = colorMap[_color] + area
    }

    // 遍历页面元素，收集可被主题替换的颜色。
    for (const el of slide.elements) {
      // 读取元素宽度用于面积估算。
      const width = el.width
      // 线条使用实际长度作为高度权重，其他元素使用 height。
      const height = el.type === 'line' ? getLineElementLength(el) : el.height
      // 估算元素面积。
      const area = width * height

      // 非透明形状填充色参与主题映射。
      if (el.type === 'shape' && tinycolor(el.fill).getAlpha() !== 0) {
        record(el.fill, area)
      }
      // 非透明文本框填充色参与主题映射。
      if (el.type === 'text' && el.fill && tinycolor(el.fill).getAlpha() !== 0) {
        record(el.fill, area)
      }
      // 图片蒙版色参与主题映射。
      if (el.type === 'image' && el.colorMask && tinycolor(el.colorMask).getAlpha() !== 0) {
        record(el.colorMask, area)
      }
      // 表格主题色参与主题映射。
      if (el.type === 'table' && el.theme && tinycolor(el.theme.color).getAlpha() !== 0) {
        record(el.theme.color, area)
      }
      // 图表颜色按与主题提取类似的权重参与映射。
      if (el.type === 'chart') {
        // 图表调色盘颜色按较小权重记录。
        for (const color of el.themeColors) {
          if (tinycolor(color).getAlpha() !== 0) {
            record(color, area / el.themeColors.length * 0.1)
          }
        }
        // 图表主色权重更高。
        if (el.themeColors[0] && tinycolor(el.themeColors[0]).getAlpha() !== 0) record(el.themeColors[0], area * 0.3)
        // 图表填充色权重最高。
        if (el.fill && tinycolor(el.fill).getAlpha() !== 0) record(el.fill, area * 0.6)
      }
      // 线条颜色参与主题映射。
      if (el.type === 'line' && tinycolor(el.color).getAlpha() !== 0) {
        record(el.color, area)
      }
      // 音频控件颜色参与主题映射。
      if (el.type === 'audio' && tinycolor(el.color).getAlpha() !== 0) {
        record(el.color, area)
      }
    }
    // 按面积权重从高到低排序颜色。
    const colors = Object.keys(colorMap).sort((a, b) => colorMap[b] - colorMap[a])
    // 返回排序后的颜色列表。
    return colors
  }
  
  /**
   * 创建旧主题颜色与新主题颜色的映射表。
   *
   * @param slide - 目标幻灯片。
   * @param _newColors - 新主题色列表。
   * @returns 旧颜色到新颜色的映射表。
   * @throws 新主题色为空时访问 `newColors[0]` 会产生不可预期结果，调用方应保证主题色有效。
   * @remarks
   * - 旧颜色按页面内面积从大到小排序。
   * - 如果旧颜色数量多于新颜色数量，会基于新主题首色生成相近色补足。
   */
  const createSlideThemeColorMap = (slide: Slide, _newColors: string[]): Record<string, string> => {
    // 拷贝新主题色列表，避免直接修改入参。
    const newColors = [..._newColors]
    // 获取当前页所有主要颜色。
    const oldColors = getSlideAllColors(slide)
    // 初始化颜色映射表。
    const themeColorMap: Record<string, string> = {}
  
    // 如果旧颜色更多，则自动生成一批类似色补足新颜色数量。
    if (oldColors.length > newColors.length) {
      // 基于新主题首色生成类似色。
      const analogous = tinycolor(newColors[0]).analogous(oldColors.length - newColors.length + 10)
      // 去掉第一个原色，保留后续类似色。
      const otherColors = analogous.map(item => item.toHexString()).slice(1)
      // 把补充色追加到新颜色列表。
      newColors.push(...otherColors)
    }
    // 按旧颜色排序顺序逐一映射到新颜色。
    for (let i = 0; i < oldColors.length; i++) {
      themeColorMap[oldColors[i]] = newColors[i]
    }
  
    // 返回旧色到新色的映射。
    return themeColorMap
  }
  
  /**
   * 将指定预置主题应用到单张幻灯片。
   *
   * @param slide - 要修改的幻灯片对象。
   * @param theme - 预置主题配置。
   * @returns 无显式返回值。
   * @throws 颜色映射、元素数据访问异常会按运行时行为表现。
   * @remarks
   * - 该函数会原地修改传入 slide。
   * - 图片背景会被保留，非图片背景会改成主题背景色。
   * - 富文本内联 color/font-family 会被移除，使默认字体色和字体生效。
   */
  const setSlideTheme = (slide: Slide, theme: PresetTheme) => {
    // 创建当前页旧主题色到新主题色的映射。
    const colorMap = createSlideThemeColorMap(slide, theme.colors)

    /**
     * 根据颜色映射表替换颜色，同时保留原透明度。
     *
     * @param color - 原颜色值。
     * @returns 映射后的颜色；没有映射时返回原颜色。
     * @throws tinycolor 解析异常会按运行时行为表现。
     */
    const getColor = (color: string) => {
      // 读取原颜色透明度。
      const alpha = tinycolor(color).getAlpha()
      // 使用去透明度后的颜色查找映射目标。
      const _color = colorMap[tinycolor(color).setAlpha(1).toRgbString()]
      // 有映射时恢复原透明度并返回，否则保留原色。
      return _color ? tinycolor(_color).setAlpha(alpha).toRgbString() : color
    }
  
    // 非图片背景会替换成主题纯色背景；图片背景保留用户原图。
    if (!slide.background || slide.background.type !== 'image') {
      slide.background = {
        type: 'solid',
        color: theme.background,
      }
    }
    // 遍历页面元素并按类型应用主题。
    for (const el of slide.elements) {
      // 形状元素替换填充色、清理渐变并更新内部文本默认样式。
      if (el.type === 'shape') {
        // 替换形状填充色。
        if (el.fill) el.fill = getColor(el.fill)
        // 应用预置主题时移除原渐变，使用主题色体系。
        if (el.gradient) delete el.gradient
        // 形状内文本存在时更新文本默认样式。
        if (el.text) {
          // 更新形状文本默认颜色。
          el.text.defaultColor = theme.fontColor
          // 更新形状文本默认字体。
          el.text.defaultFontName = theme.fontname
          // 移除富文本内联颜色和字体，使默认样式生效。
          if (el.text.content) el.text.content = el.text.content.replace(/color: .+?;/g, '').replace(/font-family: .+?;/g, '')
        }
      }
      // 文本元素替换背景填充色和默认文字样式。
      if (el.type === 'text') {
        // 替换文本框填充色。
        if (el.fill) el.fill = getColor(el.fill)
        // 更新默认文字颜色。
        el.defaultColor = theme.fontColor
        // 更新默认字体。
        el.defaultFontName = theme.fontname
        // 移除富文本内联颜色和字体，使主题默认样式生效。
        if (el.content) el.content = el.content.replace(/color: .+?;/g, '').replace(/font-family: .+?;/g, '')
      }
      // 图片蒙版颜色参与主题替换。
      if (el.type === 'image' && el.colorMask) {
        el.colorMask = getColor(el.colorMask)
      }
      // 表格更新主题色和单元格默认文字样式。
      if (el.type === 'table') {
        // 替换表格主题色。
        if (el.theme) el.theme.color = getColor(el.theme.color)
        // 遍历表格单元格。
        for (const rowCells of el.data) {
          for (const cell of rowCells) {
            // 单元格有样式对象时更新字体色和字体。
            if (cell.style) {
              cell.style.color = theme.fontColor
              cell.style.fontname = theme.fontname
            }
          }
        }
      }
      // 图表直接使用新主题完整调色板和字体色。
      if (el.type === 'chart') {
        el.themeColors = [...theme.colors]
        el.textColor = theme.fontColor
      }
      // 线条颜色替换为映射后的主题色。
      if (el.type === 'line') el.color = getColor(el.color)
      // 音频控件颜色替换为映射后的主题色。
      if (el.type === 'audio') el.color = getColor(el.color)
      // LaTeX 公式颜色使用主题字体色。
      if (el.type === 'latex') el.color = theme.fontColor

      // 存在描边的元素应用主题描边配置。
      if ('outline' in el && el.outline) {
        // 如果主题提供完整 outline，则替换整个描边对象。
        if (theme.outline) el.outline = { ...theme.outline }
        // 如果主题提供边框色，则覆盖描边颜色。
        if (theme.borderColor) el.outline.color = theme.borderColor
      }
      // 存在阴影的元素在主题提供 shadow 时应用主题阴影。
      if ('shadow' in el && el.shadow && theme.shadow) {
        el.shadow = theme.shadow
      }
    }
  }
  
  /**
   * 应用预置主题到全局主题配置，并可选择重置全部页面样式。
   *
   * @param theme - 预置主题配置。
   * @param resetSlides - 是否同时把主题应用到全部幻灯片元素。
   * @returns 无显式返回值。
   * @throws JSON 深拷贝、store 更新或历史快照写入异常会按运行时错误表现。
   * @remarks `resetSlides` 为 false 时只更新全局主题配置，不改写已有页面元素。
   */
  const applyPresetTheme = (theme: PresetTheme, resetSlides = false) => {
    // 更新全局主题配置，影响后续新建元素默认样式。
    slidesStore.setTheme({
      backgroundColor: theme.background,
      themeColors: theme.colors,
      fontColor: theme.fontColor,
      outline: {
        width: 2,
        style: 'solid',
        color: theme.borderColor,
      },
      fontName: theme.fontname,
    })

    // 如果要求重置页面，则把预置主题应用到已有全部页面。
    if (resetSlides) {
      // 深拷贝页面列表，避免直接修改响应式原对象。
      const newSlides: Slide[] = JSON.parse(JSON.stringify(slides.value))
      // 遍历每张页面并应用主题。
      for (const slide of newSlides) {
        setSlideTheme(slide, theme)
      }
      // 写回应用主题后的页面列表。
      slidesStore.setSlides(newSlides)
      // 记录历史快照。
      addHistorySnapshot()
    }
  }
  
  /**
   * 将当前全局主题配置应用到全部页面。
   *
   * @param applyAll - 是否同时应用描边和阴影等扩展主题属性。
   * @returns 无显式返回值。
   * @throws JSON 深拷贝、store 更新或历史快照写入异常会按运行时错误表现。
   * @remarks
   * - applyAll 为 false 时主要应用背景、主题色、字体色和字体。
   * - applyAll 为 true 时额外应用 outline、shadow 和 borderColor。
   */
  const applyThemeToAllSlides = (applyAll = false) => {
    // 深拷贝页面列表，避免直接修改响应式原对象。
    const newSlides: Slide[] = JSON.parse(JSON.stringify(slides.value))

    // 将当前全局主题转换为 setSlideTheme 需要的 PresetTheme 结构。
    const _theme: PresetTheme = {
      background: theme.value.backgroundColor,
      fontColor: theme.value.fontColor,
      borderColor: applyAll ? theme.value.outline.color : undefined,
      fontname: theme.value.fontName,
      colors: theme.value.themeColors,
      outline: applyAll ? theme.value.outline : undefined,
      shadow: applyAll ? theme.value.shadow : undefined,
    }
  
    // 遍历每张页面并应用当前主题。
    for (const slide of newSlides) {
      setSlideTheme(slide, _theme)
    }
    // 写回批量应用后的页面列表。
    slidesStore.setSlides(newSlides)
    // 记录历史快照。
    addHistorySnapshot()
  }

  /**
   * 将指定字体应用到全部页面中的文本类内容。
   *
   * @param fontname - 目标字体名称。
   * @returns 无显式返回值。
   * @throws JSON 深拷贝、store 更新或历史快照写入异常会按运行时错误表现。
   * @remarks
   * - 形状文本、普通文本和表格单元格会被统一字体。
   * - 富文本内联 font-family 会被移除，使默认字体生效。
   */
  const applyFontToAllSlides = (fontname: string) => {
    // 深拷贝页面列表，避免直接修改响应式原对象。
    const newSlides: Slide[] = JSON.parse(JSON.stringify(slides.value))

    // 遍历每张页面。
    for (const slide of newSlides) {
      // 遍历页面元素。
      for (const el of slide.elements) {
        // 形状内部文本更新默认字体。
        if (el.type === 'shape') {
          if (el.text) {
            // 写入形状文本默认字体。
            el.text.defaultFontName = fontname
            // 清除富文本内联字体声明，使默认字体生效。
            if (el.text.content) el.text.content = el.text.content.replace(/font-family: .+?;/g, '')
          }
        }
        // 普通文本元素更新默认字体。
        if (el.type === 'text') {
          // 写入文本默认字体。
          el.defaultFontName = fontname
          // 清除富文本内联字体声明，使默认字体生效。
          if (el.content) el.content = el.content.replace(/font-family: .+?;/g, '')
        }
        // 表格单元格更新字体名称。
        if (el.type === 'table') {
          // 遍历表格行。
          for (const rowCells of el.data) {
            // 遍历单元格。
            for (const cell of rowCells) {
              // 单元格存在样式对象时更新字体名称。
              if (cell.style) {
                cell.style.fontname = fontname
              }
            }
          }
        }
      }
    }
    // 写回统一字体后的页面列表。
    slidesStore.setSlides(newSlides)
    // 记录历史快照。
    addHistorySnapshot()
  }

  // 返回主题相关能力。
  return {
    getSlidesThemeStyles,
    applyPresetTheme,
    applyThemeToAllSlides,
    applyFontToAllSlides,
  }
}
