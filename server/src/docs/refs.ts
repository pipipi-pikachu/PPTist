import type { Slide } from '../../../src/types/slides'

// 每次写入后维护元素间引用，返回是否有改动：
// - animations[].elId 指向已不存在的元素 → 删除该动画
// - notes[].elId 指向已不存在的元素 → 清空 elId
// - 线条 startBinding/endBinding 指向已不存在的元素 → 删除绑定
export function maintainRefs(slides: Slide[]): boolean {
  let changed = false
  for (const slide of slides) {
    const elIds = new Set(slide.elements.map(el => el.id))

    if (slide.animations) {
      const kept = slide.animations.filter(anim => elIds.has(anim.elId))
      if (kept.length !== slide.animations.length) {
        slide.animations = kept
        changed = true
      }
    }

    for (const note of slide.notes ?? []) {
      if (note.elId && !elIds.has(note.elId)) {
        delete note.elId
        changed = true
      }
    }

    for (const el of slide.elements) {
      if (el.type !== 'line') continue
      if (el.startBinding && !elIds.has(el.startBinding.elementId)) {
        delete el.startBinding
        changed = true
      }
      if (el.endBinding && !elIds.has(el.endBinding.elementId)) {
        delete el.endBinding
        changed = true
      }
    }
  }
  return changed
}
