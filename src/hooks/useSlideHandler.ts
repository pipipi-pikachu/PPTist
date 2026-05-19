import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useMainStore, useSlidesStore } from '@/store'
import type { Slide } from '@/types/slides'
import { copyText, readClipboard } from '@/utils/clipboard'
import { encrypt } from '@/utils/crypto'
import { createElementIdMap } from '@/utils/element'
import { KEYS } from '@/configs/hotkey'
import message from '@/utils/message'
import usePasteTextClipboardData from '@/hooks/usePasteTextClipboardData'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useAddSlidesOrElements from '@/hooks/useAddSlidesOrElements'

/**
 * 提供幻灯片页面级操作能力。
 *
 * @returns 包含重置、切换焦点、复制粘贴、创建、删除、剪切、全选、排序和空页判断的方法集合。
 * @throws 当前 composable 不主动抛错；剪贴板、ID 生成、store 更新或历史快照写入异常会按对应函数行为表现。
 * @remarks
 * - 页面复制粘贴使用加密剪贴板数据，格式为 `{ type: 'slides', data }`。
 * - 多选页面时，当前页会被合并进 selectedSlidesIndex 参与操作。
 * - 删除所有页面时不会让演示文稿为空，而是重置为一张空白页。
 */
export default () => {
  // 获取主状态 store，用于管理缩略图多选、焦点和当前选中元素。
  const mainStore = useMainStore()
  // 获取幻灯片 store，用于管理页面列表、当前页索引和主题。
  const slidesStore = useSlidesStore()
  // 缩略图多选索引和当前选中元素列表。
  const { selectedSlidesIndex: _selectedSlidesIndex, activeElementIdList } = storeToRefs(mainStore)
  // 当前页、全部页面、主题和当前页索引。
  const { currentSlide, slides, theme, slideIndex } = storeToRefs(slidesStore)

  // 当前参与页面操作的索引：缩略图多选索引 + 当前页索引。
  const selectedSlidesIndex = computed(() => [..._selectedSlidesIndex.value, slideIndex.value])
  // 根据索引取出参与操作的页面数据。
  const selectedSlides = computed(() => slides.value.filter((item, index) => selectedSlidesIndex.value.includes(index)))
  // 提取参与操作页面的 ID 列表。
  const selectedSlidesId = computed(() => selectedSlides.value.map(item => item.id))

  // 获取剪贴板文本粘贴解析方法，用于页面粘贴。
  const { pasteTextClipboardData } = usePasteTextClipboardData()
  // 获取从页面数据添加页面的方法，用于复制当前页到下一页。
  const { addSlidesFromData } = useAddSlidesOrElements()
  // 获取历史快照写入方法。
  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 重置演示文稿为一张空白幻灯片。
   *
   * @returns 无显式返回值。
   * @throws ID 生成或 store 更新异常会按运行时错误表现。
   * @remarks 重置时会清空选中元素，并把当前页索引设为 0。
   */
  const resetSlides = () => {
    // 构造一张使用当前主题背景色的空白页。
    const emptySlide: Slide = {
      id: nanoid(10),
      elements: [],
      background: {
        type: 'solid',
        color: theme.value.backgroundColor,
      },
    }
    // 将当前页索引重置到第一页。
    slidesStore.updateSlideIndex(0)
    // 清空元素选中状态。
    mainStore.setActiveElementIdList([])
    // 用空白页替换整个页面列表。
    slidesStore.setSlides([emptySlide])
  }

  /**
   * 移动当前页面焦点。
   *
   * @param command - 移动页面焦点命令：上移或下移。
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 页面切换时会清空元素选中状态，避免跨页引用旧元素。
   */
  const updateSlideIndex = (command: string) => {
    // 上移且当前页不是第一页时，切换到上一页。
    if (command === KEYS.UP && slideIndex.value > 0) {
      // 页面切换前清空元素选区。
      if (activeElementIdList.value.length) mainStore.setActiveElementIdList([])
      // 更新当前页索引。
      slidesStore.updateSlideIndex(slideIndex.value - 1)
    }
    // 下移且当前页不是最后一页时，切换到下一页。
    else if (command === KEYS.DOWN && slideIndex.value < slides.value.length - 1) {
      // 页面切换前清空元素选区。
      if (activeElementIdList.value.length) mainStore.setActiveElementIdList([])
      // 更新当前页索引。
      slidesStore.updateSlideIndex(slideIndex.value + 1)
    }
  }

  /**
   * 将当前参与操作的页面数据加密后复制到剪贴板。
   *
   * @returns 无显式返回值。
   * @throws 加密或剪贴板写入异常会按对应函数行为表现。
   * @remarks 复制成功后会把焦点切回缩略图区域，方便继续使用页面快捷键。
   */
  const copySlide = () => {
    // 构造页面剪贴板数据并加密。
    const text = encrypt(JSON.stringify({
      type: 'slides',
      data: selectedSlides.value,
    }))

    // 写入系统剪贴板。
    copyText(text).then(() => {
      // 复制完成后保持缩略图区域焦点。
      mainStore.setThumbnailsFocus(true)
    })
  }

  /**
   * 从剪贴板读取页面数据并粘贴为新页面。
   *
   * @returns 无显式返回值。
   * @throws 剪贴板读取失败会进入 catch 并显示 warning，不主动向上抛错。
   * @remarks 使用 `onlySlide` 限制粘贴解析只处理页面数据。
   */
  const pasteSlide = () => {
    // 读取系统剪贴板纯文本。
    readClipboard().then(text => {
      // 只允许按页面数据解析和粘贴。
      pasteTextClipboardData(text, { onlySlide: true })
    // 剪贴板读取失败时提示用户。
    }).catch(err => message.warning(err))
  }

  /**
   * 创建一张空白幻灯片并添加到当前页之后。
   *
   * @returns 无显式返回值。
   * @throws ID 生成、store 更新或历史快照写入异常会按运行时错误表现。
   * @remarks 新页面背景色使用当前主题背景色。
   */
  const createSlide = () => {
    // 构造新空白页。
    const emptySlide: Slide = {
      id: nanoid(10),
      elements: [],
      background: {
        type: 'solid',
        color: theme.value.backgroundColor,
      },
    }
    // 创建页面前清空元素选区。
    mainStore.setActiveElementIdList([])
    // 将空白页添加到当前页之后。
    slidesStore.addSlide(emptySlide)
    // 记录历史快照，支持撤销创建页面。
    addHistorySnapshot()
  }

  /**
   * 根据模板创建新页面。
   *
   * @param slide - 模板页面数据。
   * @returns 无显式返回值。
   * @throws ID 生成、store 更新或历史快照写入异常会按运行时错误表现。
   * @remarks 会重建模板内元素 ID 和组合 ID，避免与现有页面数据冲突。
   */
  const createSlideByTemplate = (slide: Slide) => {
    // 为模板元素生成新元素 ID 和组合 ID 映射。
    const { groupIdMap, elIdMap } = createElementIdMap(slide.elements)

    // 遍历模板元素并替换 ID。
    for (const element of slide.elements) {
      // 替换元素 ID。
      element.id = elIdMap[element.id]
      // 替换组合 ID，保持组内元素仍属于同一新组合。
      if (element.groupId) element.groupId = groupIdMap[element.groupId]
    }
    // 构造新页面并生成新页面 ID。
    const newSlide = {
      ...slide,
      id: nanoid(10),
    }
    // 创建页面前清空元素选区。
    mainStore.setActiveElementIdList([])
    // 将模板页添加到当前页之后。
    slidesStore.addSlide(newSlide)
    // 记录历史快照。
    addHistorySnapshot()
  }

  /**
   * 将当前页复制一份并粘贴到当前页之后。
   *
   * @returns 无显式返回值。
   * @throws JSON 深拷贝或添加页面异常会按对应函数行为表现。
   * @remarks 通过 `addSlidesFromData()` 统一处理 ID 重建和引用修正。
   */
  const copyAndPasteSlide = () => {
    // 深拷贝当前页，避免添加过程中直接修改原页面对象。
    const slide = JSON.parse(JSON.stringify(currentSlide.value))
    // 作为外部页面数据添加，从而复用 ID 重建逻辑。
    addSlidesFromData([slide])
  }

  /**
   * 删除指定页面；如果会删除全部页面，则重置为一张空白页。
   *
   * @param targetSlidesId - 要删除的页面 ID 列表，默认删除当前参与操作的页面。
   * @returns 无显式返回值。
   * @throws store 更新或历史快照写入异常会按运行时错误表现。
   * @remarks 删除后会清空缩略图多选状态。
   */
  const deleteSlide = (targetSlidesId = selectedSlidesId.value) => {
    // 如果目标数量等于总页数，不能让演示文稿为空，转为重置空白页。
    if (slides.value.length === targetSlidesId.length) resetSlides()
    // 否则按 ID 删除目标页面。
    else slidesStore.deleteSlide(targetSlidesId)

    // 删除后清空缩略图多选索引。
    mainStore.updateSelectedSlidesIndex([])

    // 记录历史快照，支持撤销删除页面。
    addHistorySnapshot()
  }

  // 将当前页复制后删除（剪切）
  // 由于复制操作会导致多选状态消失，所以需要提前将需要删除的页面ID进行缓存
  /**
   * 剪切当前参与操作的页面。
   *
   * @returns 无显式返回值。
   * @throws 复制或删除流程异常会按对应函数行为表现。
   * @remarks 先缓存待删除页面 ID，避免复制后多选状态变化导致删除目标丢失。
   */
  const cutSlide = () => {
    // 缓存待删除页面 ID。
    const targetSlidesId = [...selectedSlidesId.value]
    // 将页面数据复制到剪贴板。
    copySlide()
    // 删除缓存的目标页面。
    deleteSlide(targetSlidesId)
  }

  /**
   * 选中全部幻灯片。
   *
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 会清空元素选中状态，并把所有页面索引写入缩略图多选列表。
   */
  const selectAllSlide = () => {
    // 生成从 0 到 slides.length - 1 的全部页面索引。
    const newSelectedSlidesIndex = Array.from(Array(slides.value.length), (item, index) => index)
    // 全选页面前清空元素选中状态。
    mainStore.setActiveElementIdList([])
    // 写入缩略图多选索引。
    mainStore.updateSelectedSlidesIndex(newSelectedSlidesIndex)
  }

  /**
   * 同步拖拽排序后的幻灯片顺序。
   *
   * @param newIndex - 拖拽后的新索引。
   * @param oldIndex - 拖拽前的旧索引。
   * @returns 无显式返回值。
   * @throws JSON 深拷贝或 store 更新异常会按运行时错误表现。
   * @remarks
   * - 会处理 sectionTag 在拖拽排序时的归属迁移。
   * - 当前函数不记录历史快照，保持既有行为。
   */
  const sortSlides = (newIndex: number, oldIndex: number) => {
    // 索引未变化时无需处理。
    if (oldIndex === newIndex) return
  
    // 深拷贝页面列表，避免直接修改 store 中的响应式数组。
    const _slides: Slide[] = JSON.parse(JSON.stringify(slides.value))

    // 读取正在移动的页面。
    const movingSlide = _slides[oldIndex]
    // 记录该页面原本携带的节标记。
    const movingSlideSection = movingSlide.sectionTag
    // 如果移动页本身是某个节的起点，需要把节标记交接给原位置下一页。
    if (movingSlideSection) {
      // 读取原位置下一页。
      const movingSlideSectionNext = _slides[oldIndex + 1]
      // 移动页先移除节标记。
      delete movingSlide.sectionTag
      // 如果下一页存在且不是另一个节起点，则让下一页继承该节标记。
      if (movingSlideSectionNext && !movingSlideSectionNext.sectionTag) {
        movingSlideSectionNext.sectionTag = movingSlideSection
      }
    }
    // 如果拖拽到第一位，需要处理原首页节标记。
    if (newIndex === 0) {
      // 读取当前列表第一张页面上的节标记。
      const firstSection = _slides[0].sectionTag
      // 若原首页有节标记，则转移给移动页。
      if (firstSection) {
        // 原首页移除节标记。
        delete _slides[0].sectionTag
        // 移动页成为新的节起点。
        movingSlide.sectionTag = firstSection
      }
    }

    // 取出待移动页面。
    const _slide = _slides[oldIndex]
    // 从旧位置移除页面。
    _slides.splice(oldIndex, 1)
    // 插入到新位置。
    _slides.splice(newIndex, 0, _slide)
    // 写回排序后的页面列表。
    slidesStore.setSlides(_slides)
    // 当前页索引同步到拖拽后的新位置。
    slidesStore.updateSlideIndex(newIndex)
  }

  /**
   * 当前演示文稿是否只有一张空白页。
   *
   * @returns 当页面数为 1 且唯一页面没有元素时返回 `true`。
   * @remarks 常用于控制删除、重置或空状态 UI。
   */
  const isEmptySlide = computed(() => {
    // 多于一页时不视为空演示文稿。
    if (slides.value.length > 1) return false
    // 唯一页面存在元素时不视为空页。
    if (slides.value[0].elements.length > 0) return false
    // 只有一页且没有元素时视为空页。
    return true
  })

  // 返回页面操作相关方法和状态。
  return {
    resetSlides,
    updateSlideIndex,
    copySlide,
    pasteSlide,
    createSlide,
    createSlideByTemplate,
    copyAndPasteSlide,
    deleteSlide,
    cutSlide,
    selectAllSlide,
    sortSlides,
    isEmptySlide,
  }
}
