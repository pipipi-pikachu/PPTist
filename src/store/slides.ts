import { defineStore } from 'pinia'
import { omit } from 'lodash'
import type { Slide, SlideTheme, PPTElement, PPTAnimation, SlideTemplate } from '@/types/slides'

interface RemovePropData {
  id: string
  propName: string | string[]
}

interface UpdateElementData {
  id: string | string[]
  props: Partial<PPTElement>
  slideId?: string
}

interface FormatedAnimation {
  animations: PPTAnimation[]
  autoNext: boolean
}

export interface SlidesState {
  title: string
  theme: SlideTheme
  slides: Slide[]
  slideIndex: number
  viewportSize: number
  viewportRatio: number
  templates: SlideTemplate[]
}

export const useSlidesStore = defineStore('slides', {
  /**
   * 幻灯片 store 的初始状态。
   *
   * @returns 默认文稿状态，包含标题、主题、页面列表、当前页索引、视口参数和内置 AIPPT 模板入口。
   * @throws 当前函数不主动抛错；Pinia 会在 store 创建阶段调用该函数。
   * @remarks
   * - `slides` 初始为空，应用启动后通常会由加载流程或重置流程写入至少一张页面。
   * - `templates` 只保存模板元信息和封面图，真正模板页面数据通过 `api.getMockData(templateId)` 读取。
   */
  state: (): SlidesState => ({
    title: '未命名演示文稿', // 幻灯片标题
    theme: {
      themeColors: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4', '#70ad47'],
      fontColor: '#333',
      fontName: '',
      backgroundColor: '#fff',
      shadow: {
        h: 3,
        v: 3,
        blur: 2,
        color: '#808080',
      },
      outline: {
        width: 2,
        color: '#525252',
        style: 'solid',
      },
    }, // 主题样式
    slides: [], // 幻灯片页面数据
    slideIndex: 0, // 当前页面索引
    viewportSize: 1000, // 可视区域宽度基数
    viewportRatio: 0.5625, // 可视区域比例，默认16:9
    templates: [
      { name: '山河映红', id: 'template_1', cover: './imgs/template_1.webp', origin: '官方制作' },
      { name: '都市蓝调', id: 'template_2', cover: './imgs/template_2.webp', origin: '官方制作' },
      { name: '智感几何', id: 'template_3', cover: './imgs/template_3.webp', origin: '官方制作' },
      { name: '柔光莫兰迪', id: 'template_4', cover: './imgs/template_4.webp', origin: '官方制作' },
      { name: '简约绿意', id: 'template_5', cover: './imgs/template_5.webp', origin: '社区贡献+官方深度完善优化' },
      { name: '暖色复古', id: 'template_6', cover: './imgs/template_6.webp', origin: '社区贡献+官方深度完善优化' },
      { name: '深邃沉稳', id: 'template_7', cover: './imgs/template_7.webp', origin: '社区贡献+官方深度完善优化' },
      { name: '浅蓝小清新', id: 'template_8', cover: './imgs/template_8.webp', origin: '社区贡献+官方深度完善优化' },
    ], // 模板
  }),

  getters: {
    /**
     * 当前正在编辑的幻灯片。
     *
     * @param state - Pinia 注入的当前 slides store 状态。
     * @returns 当前 `slideIndex` 对应的页面数据；如果页面列表为空或索引越界则返回 `undefined`。
     * @throws 当前 getter 不主动抛错。
     * @remarks AIPPT 生成过程中可能先重置或追加页面，调用方需要注意空页面列表的边界情况。
     */
    currentSlide(state) {
      // 根据当前页索引读取页面，保持所有编辑面板使用同一页数据源。
      return state.slides[state.slideIndex]
    },
  
    /**
     * 当前页仍然有效的动画列表。
     *
     * @param state - Pinia 注入的当前 slides store 状态。
     * @returns 只包含绑定到当前页现存元素的动画；当前页不存在动画时返回空数组。
     * @throws 当前 getter 不主动抛错。
     * @remarks 页面元素被删除后，旧动画可能残留在数据中，因此需要按元素 ID 二次过滤。
     */
    currentSlideAnimations(state) {
      // 当前页不存在或没有动画时，直接返回空数组，避免后续访问 undefined。
      const currentSlide = state.slides[state.slideIndex]
      // 没有动画配置时无需继续过滤。
      if (!currentSlide?.animations) return []

      // 读取当前页全部元素，用于判断动画绑定目标是否还存在。
      const els = currentSlide.elements
      // 提取当前页有效元素 ID 列表。
      const elIds = els.map(el => el.id)
      // 只保留绑定元素仍在页面中的动画，避免动画面板展示孤儿动画。
      return currentSlide.animations.filter(animation => elIds.includes(animation.elId))
    },

    /**
     * 格式化后的当前页动画播放序列。
     *
     * @param state - Pinia 注入的当前 slides store 状态。
     * @returns 按点击序列分组后的动画数组，每组包含同一播放节点的动画和是否自动进入下一组的标记。
     * @throws 当前 getter 不主动抛错。
     * @remarks
     * - `click` 表示新建一个播放组。
     * - `meantime` 表示与上一组同时播放，会合并到上一组。
     * - `auto` 表示上一组播放后自动进入当前动画，会给上一组设置 `autoNext`。
     */
    formatedAnimations(state) {
      // 读取当前页，当前页不存在时直接返回空数组。
      const currentSlide = state.slides[state.slideIndex]
      // 没有动画配置时无需格式化。
      if (!currentSlide?.animations) return []

      // 当前页元素列表，用于过滤无效动画绑定。
      const els = currentSlide.elements
      // 当前页有效元素 ID 列表。
      const elIds = els.map(el => el.id)
      // 删除绑定元素不存在的动画，避免播放序列引用已删除元素。
      const animations = currentSlide.animations.filter(animation => elIds.includes(animation.elId))

      // 格式化后的动画组列表。
      const formatedAnimations: FormatedAnimation[] = []
      // 按原始动画顺序逐项合并触发关系。
      for (const animation of animations) {
        // 点击触发或第一项动画都需要创建新的播放组。
        if (animation.trigger === 'click' || !formatedAnimations.length) {
          formatedAnimations.push({ animations: [animation], autoNext: false })
        }
        // 同时播放动画合并到上一组，且同一元素只保留后出现的动画配置。
        else if (animation.trigger === 'meantime') {
          // 读取上一组动画。
          const last = formatedAnimations[formatedAnimations.length - 1]
          // 移除上一组中同元素旧动画，避免一个元素同一组内重复动画冲突。
          last.animations = last.animations.filter(item => item.elId !== animation.elId)
          // 把当前动画加入上一组，实现“与上一动画同时”。
          last.animations.push(animation)
          // 写回上一组，确保响应式数组引用更新。
          formatedAnimations[formatedAnimations.length - 1] = last
        }
        // 自动触发动画会使上一组播放完成后自动进入下一组。
        else if (animation.trigger === 'auto') {
          // 读取上一组动画。
          const last = formatedAnimations[formatedAnimations.length - 1]
          // 标记上一组播放结束后自动继续。
          last.autoNext = true
          // 写回上一组。
          formatedAnimations[formatedAnimations.length - 1] = last
          // 当前自动动画单独形成下一组。
          formatedAnimations.push({ animations: [animation], autoNext: false })
        }
      }
      // 返回格式化后的动画播放序列。
      return formatedAnimations
    },
  },

  actions: {
    /**
     * 设置演示文稿标题。
     *
     * @param title - 新标题；传入空字符串时会回退为默认标题“未命名演示文稿”。
     * @returns 无显式返回值。
     * @throws 当前 action 不主动抛错。
     * @remarks 该方法只更新标题，不会写入历史快照，调用方如需撤销能力需要自行处理。
     */
    setTitle(title: string) {
      // 空标题统一归一化为默认标题，避免界面展示空白文稿名。
      if (!title) this.title = '未命名演示文稿'
      // 非空标题直接写入 store。
      else this.title = title
    },

    /**
     * 合并更新当前演示文稿主题。
     *
     * @param themeProps - 需要覆盖的主题字段，例如主题色、字体、背景、阴影或边框配置。
     * @returns 无显式返回值。
     * @throws 当前 action 不主动抛错；传入字段结构异常时会按普通对象合并结果表现。
     * @remarks
     * - `createPPT()` 在 AI 页面流结束后会调用该方法写入模板主题。
     * - 这里使用浅合并，嵌套对象字段会整体覆盖而不是深度合并。
     */
    setTheme(themeProps: Partial<SlideTheme>) {
      // 使用浅合并保留未传入的旧主题字段，同时覆盖本次指定的主题字段。
      this.theme = { ...this.theme, ...themeProps }
    },
  
    /**
     * 设置编辑器视口宽度基准。
     *
     * @param size - 新视口宽度基准值，通常用于画布缩放和布局计算。
     * @returns 无显式返回值。
     * @throws 当前 action 不主动抛错。
     * @remarks 该方法只写入数值，不校验最小值或最大值，调用方需要保证传入值合理。
     */
    setViewportSize(size: number) {
      // 更新视口宽度基准，画布渲染层会基于该值计算显示尺寸。
      this.viewportSize = size
    },
  
    /**
     * 设置编辑器视口宽高比例。
     *
     * @param viewportRatio - 新视口比例，默认项目使用 16:9 对应的 `0.5625`。
     * @returns 无显式返回值。
     * @throws 当前 action 不主动抛错。
     * @remarks 该方法不主动重排已有元素，只影响画布和页面尺寸相关计算。
     */
    setViewportRatio(viewportRatio: number) {
      // 更新视口宽高比，影响页面渲染高度和缩略图比例。
      this.viewportRatio = viewportRatio
    },
  
    /**
     * 替换当前演示文稿的全部幻灯片。
     *
     * @param slides - 新页面列表；AIPPT 在空白文稿生成时会直接传入生成后的页面列表。
     * @param themeProps - 可选主题字段；传入时会同步调用 `setTheme()` 合并到当前主题。
     * @returns 无显式返回值。
     * @throws 当前 action 不主动抛错；页面数据结构异常会在后续渲染或编辑时体现。
     * @remarks
     * - 该方法是直接替换，不会自动重建页面 ID 或元素 ID。
     * - 如果页面来自外部导入且需要避免 ID 冲突，应优先使用 `addSlidesFromData()` 之类的适配入口。
     */
    setSlides(slides: Slide[], themeProps?: Partial<SlideTheme>) {
      // 用新页面列表整体替换当前文稿页面列表。
      this.slides = slides
      // 如果调用方同时传入主题配置，则合并更新全局主题。
      if (themeProps) this.setTheme(themeProps)
    },
  
    /**
     * 设置模板入口元信息列表。
     *
     * @param templates - 模板卡片元信息，通常包含名称、ID、封面和来源。
     * @returns 无显式返回值。
     * @throws 当前 action 不主动抛错。
     * @remarks 这里只保存模板选择面板所需的轻量信息，不保存完整模板页面数据。
     */
    setTemplates(templates: SlideTemplate[]) {
      // 替换模板入口列表，模板选择面板会随之重新渲染。
      this.templates = templates
    },
  
    /**
     * 在当前页之后插入一个或多个幻灯片。
     *
     * @param slide - 单张页面或页面数组；`addSlidesFromData()` 会传入已重建 ID 的页面数组。
     * @returns 无显式返回值。
     * @throws 当前 action 不主动抛错；数组 splice 失败或数据结构异常按运行时行为表现。
     * @remarks
     * - 插入前会移除传入页面上的 `sectionTag`，避免外部页面直接污染当前文稿章节结构。
     * - 插入后当前页索引会跳到新增页面的起始位置。
     */
    addSlide(slide: Slide | Slide[]) {
      // 统一转成数组，方便单页和多页共用同一插入逻辑。
      const slides = Array.isArray(slide) ? slide : [slide]
      // 遍历待插入页面，清理章节标记，防止导入页或模板页携带旧章节信息。
      for (const slide of slides) {
        // 删除 sectionTag 后，该页面不会自动成为某个章节起点。
        if (slide.sectionTag) delete slide.sectionTag
      }

      // 新页面插入到当前页之后，符合编辑器“在当前页后添加”的交互预期。
      const addIndex = this.slideIndex + 1
      // 使用 splice 原地插入页面，保持 Pinia 响应式数组更新。
      this.slides.splice(addIndex, 0, ...slides)
      // 当前页切换到新增页面起始位置，便于用户立即看到新增内容。
      this.slideIndex = addIndex
    },
  
    /**
     * 更新指定幻灯片的部分字段。
     *
     * @param props - 需要合并到目标页面上的字段。
     * @param slideId - 可选目标页面 ID；缺省时更新当前页。
     * @returns 无显式返回值。
     * @throws 当 `slideId` 不存在或当前页索引无效时，可能因目标页面为 `undefined` 导致运行时异常。
     * @remarks 使用浅合并更新页面对象，嵌套字段需要调用方自行传入完整结构。
     */
    updateSlide(props: Partial<Slide>, slideId?: string) {
      // 有 slideId 时按 ID 查找页面，否则默认使用当前页索引。
      const slideIndex = slideId ? this.slides.findIndex(item => item.id === slideId) : this.slideIndex
      // 浅合并目标页面字段并写回数组，触发视图更新。
      this.slides[slideIndex] = { ...this.slides[slideIndex], ...props }
    },
  
    /**
     * 删除指定幻灯片上的一个或多个字段。
     *
     * @param data - 删除参数，包含目标页面 ID 和要移除的字段名或字段名数组。
     * @returns 无显式返回值。
     * @throws 当前 action 不主动抛错。
     * @remarks 使用 lodash `omit()` 返回新对象，避免直接 delete store 中的页面字段。
     */
    removeSlideProps(data: RemovePropData) {
      // 解构目标页面 ID 和待删除字段名。
      const { id, propName } = data

      // 遍历页面列表，仅对目标页面移除指定字段。
      const slides = this.slides.map(slide => {
        // 命中目标页时返回 omit 后的新对象，未命中时保持原页面对象。
        return slide.id === id ? omit(slide, propName) : slide
      }) as Slide[]
      // 写回新页面列表，触发响应式更新。
      this.slides = slides
    },
  
    deleteSlide(slideId: string | string[]) {
      const slidesId = Array.isArray(slideId) ? slideId : [slideId]
      const slides: Slide[] = JSON.parse(JSON.stringify(this.slides))
  
      const deleteSlidesIndex = []
      for (const deletedId of slidesId) {
        const index = slides.findIndex(item => item.id === deletedId)
        deleteSlidesIndex.push(index)

        const deletedSlideSection = slides[index].sectionTag
        if (deletedSlideSection) {
          const handleSlideNext = slides[index + 1]
          if (handleSlideNext && !handleSlideNext.sectionTag) {
            delete slides[index].sectionTag
            slides[index + 1].sectionTag = deletedSlideSection
          }
        }

        slides.splice(index, 1)
      }
      let newIndex = Math.min(...deleteSlidesIndex)
  
      const maxIndex = slides.length - 1
      if (newIndex > maxIndex) newIndex = maxIndex
  
      this.slideIndex = newIndex
      this.slides = slides
    },
  
    updateSlideIndex(index: number) {
      this.slideIndex = index
    },
  
    addElement(element: PPTElement | PPTElement[]) {
      const elements = Array.isArray(element) ? element : [element]
      const currentSlideEls = this.slides[this.slideIndex].elements
      const newEls = [...currentSlideEls, ...elements]
      this.slides[this.slideIndex].elements = newEls
    },

    deleteElement(elementId: string | string[]) {
      const elementIdList = Array.isArray(elementId) ? elementId : [elementId]
      const currentSlideEls = this.slides[this.slideIndex].elements
      const newEls = currentSlideEls.filter(item => !elementIdList.includes(item.id))
      this.slides[this.slideIndex].elements = newEls
    },
  
    updateElement(data: UpdateElementData) {
      const { id, props, slideId } = data
      const elIdList = typeof id === 'string' ? [id] : id

      const slideIndex = slideId ? this.slides.findIndex(item => item.id === slideId) : this.slideIndex
      const slide = this.slides[slideIndex]
      const elements = slide.elements.map(el => {
        return elIdList.includes(el.id) ? { ...el, ...props } : el
      })
      this.slides[slideIndex].elements = (elements as PPTElement[])
    },
  
    removeElementProps(data: RemovePropData) {
      const { id, propName } = data
      const propsNames = typeof propName === 'string' ? [propName] : propName
  
      const slideIndex = this.slideIndex
      const slide = this.slides[slideIndex]
      const elements = slide.elements.map(el => {
        return el.id === id ? omit(el, propsNames) : el
      })
      this.slides[slideIndex].elements = (elements as PPTElement[])
    },
  },
})
