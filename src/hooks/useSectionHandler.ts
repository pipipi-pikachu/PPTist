import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useSlidesStore } from '@/store'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useSlideHandler from '@/hooks/useSlideHandler'

/**
 * 提供幻灯片节（section）管理能力。
 *
 * @returns 包含创建节、删除节标记、删除全部节、删除某节页面、更新节标题的方法集合。
 * @throws 当前 composable 不主动抛错；ID 生成、store 更新或历史快照写入异常会按运行时错误表现。
 * @remarks
 * - 节信息存放在某张幻灯片的 `sectionTag` 上，带 sectionTag 的页面表示一个节的起点。
 * - 删除某节页面时，会从节起点开始删除到下一个节起点之前。
 * - 删除页面复用 `useSlideHandler().deleteSlide()`，以保持删除最后页面时的重置逻辑一致。
 */
export default () => {
  // 获取幻灯片 store，用于读写页面列表和页面属性。
  const slidesStore = useSlidesStore()
  // 当前全部幻灯片列表。
  const { slides } = storeToRefs(slidesStore)

  // 获取历史快照写入方法。
  const { addHistorySnapshot } = useHistorySnapshot()
  // 获取页面删除方法，用于删除某个节内的所有页面。
  const { deleteSlide } = useSlideHandler()

  /**
   * 在当前幻灯片上创建节起点。
   *
   * @returns 无显式返回值。
   * @throws ID 生成、store 更新或历史快照写入异常会按运行时错误表现。
   * @remarks 只写入 sectionTag.id，标题可后续通过 `updateSectionTitle()` 设置。
   */
  const createSection = () => {
    // 为当前页写入新的 sectionTag。
    slidesStore.updateSlide({
      sectionTag: {
        id: nanoid(6),
      },
    })
    // 记录历史快照。
    addHistorySnapshot()
  }

  /**
   * 移除指定节的起点标记。
   *
   * @param sectionId - 需要移除的节 ID。
   * @returns 无显式返回值。
   * @throws 找不到对应节时当前非空断言可能导致运行时异常，调用方应保证 sectionId 有效。
   * @remarks 该函数只移除 sectionTag，不删除节内页面。
   */
  const removeSection = (sectionId: string) => {
    // 空 ID 无法定位节，直接返回。
    if (!sectionId) return

    // 找到带有目标 sectionTag 的页面。
    const slide = slides.value.find(slide => slide.sectionTag?.id === sectionId)!
    // 从该页面移除 sectionTag 属性。
    slidesStore.removeSlideProps({
      id: slide.id,
      propName: 'sectionTag',
    })
    // 记录历史快照。
    addHistorySnapshot()
  }

  /**
   * 移除全部节标记。
   *
   * @returns 无显式返回值。
   * @throws store 更新或历史快照写入异常会按运行时错误表现。
   * @remarks 只删除每页上的 sectionTag，不删除任何页面。
   */
  const removeAllSection = () => {
    // 遍历页面并删除已有 sectionTag。
    const _slides = slides.value.map(slide => {
      // 如果当前页是节起点，则移除节标记。
      if (slide.sectionTag) delete slide.sectionTag
      // 返回处理后的页面对象。
      return slide
    })
    // 写回移除全部节标记后的页面列表。
    slidesStore.setSlides(_slides)
    // 记录历史快照。
    addHistorySnapshot()
  }

  /**
   * 删除指定节内的全部页面。
   *
   * @param sectionId - 目标节 ID；为空时从第一页开始删除到下一个节起点之前。
   * @returns 无显式返回值。
   * @throws 删除页面流程异常会按 `deleteSlide()` 的行为表现。
   * @remarks 删除范围包含节起点页面，不包含下一个节起点页面。
   */
  const removeSectionSlides = (sectionId: string) => {
    // 默认从第一页开始，用于处理默认节。
    let startIndex = 0
    // 如果指定了节 ID，则找到该节起点索引。
    if (sectionId) {
      startIndex = slides.value.findIndex(slide => slide.sectionTag?.id === sectionId)
    }
    // 收集需要删除的页面 ID。
    const ids: string[] = []
    
    // 从节起点开始向后收集页面，直到遇到下一个节起点。
    for (let i = startIndex; i < slides.value.length; i++) {
      // 当前遍历页面。
      const slide = slides.value[i]
      // 非起点位置遇到新的 sectionTag，说明已经进入下一个节，停止收集。
      if (i !== startIndex && slide.sectionTag) break

      // 当前页面属于目标节，加入删除列表。
      ids.push(slide.id)
    }

    // 复用页面删除逻辑删除目标节页面。
    deleteSlide(ids)
  }

  /**
   * 更新指定节标题。
   *
   * @param sectionId - 目标节 ID；`default` 表示默认节。
   * @param title - 新标题。
   * @returns 无显式返回值。
   * @throws ID 生成、store 更新或历史快照写入异常会按运行时错误表现。
   * @remarks
   * - 默认节没有现成 sectionTag 时，会在第一页创建 sectionTag。
   * - 非默认节会保留原 sectionTag 的其他字段，只更新 title。
   */
  const updateSectionTitle = (sectionId: string, title: string) => {
    // 空标题不更新。
    if (!title) return

    // default 表示默认节，默认节标题写到第一页的 sectionTag。
    if (sectionId === 'default') {
      // 为第一页写入新的默认节标记和标题。
      slidesStore.updateSlide({
        sectionTag: {
          id: nanoid(6),
          title,
        },
      }, slides.value[0].id)
    }
    // 普通节按 sectionId 查找节起点页面。
    else {
      // 查找目标节起点页面。
      const slide = slides.value.find(slide => slide.sectionTag?.id === sectionId)
      // 找不到节时直接返回。
      if (!slide) return

      // 更新该节的标题，保留原 sectionTag 其他字段。
      slidesStore.updateSlide({
        sectionTag: {
          ...slide.sectionTag!,
          title,
        },
      }, slide.id)
    }
    // 记录历史快照。
    addHistorySnapshot()
  }

  // 返回节管理相关方法。
  return {
    createSection,
    removeSection,
    removeAllSection,
    removeSectionSlides,
    updateSectionTitle,
  }
}
