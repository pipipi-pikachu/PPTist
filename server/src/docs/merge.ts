import { isDeepStrictEqual } from 'node:util'

import type { Slide } from '../../../src/types/slides'
import type { DocData } from '../schema/document'

export type MergeOutcome = { result: DocData, conflicts?: undefined } | { result?: undefined, conflicts: string[] }

interface WithId {
  id: string
}

// 三方合并：base = baseVersion 快照，mine = 服务端当前版本，theirs = 网页端提交版本
// 每一层同一条规则：只有一边相对 base 改了就取那一边；两边都改且结果不同 → 冲突
export function mergeDocuments(base: DocData, mine: DocData, theirs: DocData): MergeOutcome {
  const conflicts: string[] = []
  const result: DocData = {
    title: mergeValue(base.title, mine.title, theirs.title, 'title', conflicts),
    theme: mergeValue(base.theme, mine.theme, theirs.theme, 'theme', conflicts),
    viewportSize: mergeValue(base.viewportSize, mine.viewportSize, theirs.viewportSize, 'viewportSize', conflicts),
    viewportRatio: mergeValue(base.viewportRatio, mine.viewportRatio, theirs.viewportRatio, 'viewportRatio', conflicts),
    slides: mergeList(base.slides, mine.slides, theirs.slides, 'slides', mergeSlide, conflicts),
  }
  if (conflicts.length) return { conflicts }
  return { result }
}

function mergeValue<T>(base: T, mine: T, theirs: T, path: string, conflicts: string[]): T {
  const mineChanged = !isDeepStrictEqual(mine, base)
  const theirsChanged = !isDeepStrictEqual(theirs, base)
  if (!mineChanged) return theirs
  if (!theirsChanged) return mine
  if (isDeepStrictEqual(mine, theirs)) return mine
  conflicts.push(path)
  return mine
}

type ItemMerger<T extends WithId> = (base: T, mine: T, theirs: T, path: string, conflicts: string[]) => T

// 按 id 合并列表（页面列表、元素列表共用）
function mergeList<T extends WithId>(
  baseList: T[],
  mineList: T[],
  theirsList: T[],
  path: string,
  mergeItem: ItemMerger<T>,
  conflicts: string[],
): T[] {
  const baseById = new Map(baseList.map(item => [item.id, item]))
  const mineById = new Map(mineList.map(item => [item.id, item]))
  const theirsById = new Map(theirsList.map(item => [item.id, item]))

  const allIds: string[] = []
  for (const list of [baseList, mineList, theirsList]) {
    for (const item of list) {
      if (!allIds.includes(item.id)) allIds.push(item.id)
    }
  }

  const merged = new Map<string, T>()
  for (const id of allIds) {
    const b = baseById.get(id)
    const m = mineById.get(id)
    const t = theirsById.get(id)
    const itemPath = `${path}[id=${id}]`

    if (!b) {
      // 两边新增的碰巧同 id：一致才保留，否则冲突
      if (m && t) {
        if (isDeepStrictEqual(m, t)) merged.set(id, m)
        else conflicts.push(itemPath)
      }
      else if (m) merged.set(id, m)
      else if (t) merged.set(id, t)
      continue
    }

    if (!m && !t) continue // 两边都删了

    if (!m) {
      // 服务端删、网页端改 → 冲突；网页端没动 → 删除成立
      if (isDeepStrictEqual(t, b)) continue
      conflicts.push(itemPath)
      continue
    }
    if (!t) {
      if (isDeepStrictEqual(m, b)) continue
      conflicts.push(itemPath)
      continue
    }
    merged.set(id, mergeItem(b, m, t, itemPath, conflicts))
  }

  // 顺序：哪边改了顺序取哪边，两边都改以服务端（mine）为准；都没改按 base 顺序
  const baseOrder = orderOf(baseList, merged)
  const mineReordered = !isDeepStrictEqual(orderOf(mineList, merged), baseOrder)
  const theirsReordered = !isDeepStrictEqual(orderOf(theirsList, merged), baseOrder)

  if (!mineReordered && !theirsReordered) {
    let final = baseOrder.map(id => merged.get(id)!)
    // 两边都没改顺序：base 顺序为准，两边各自的新项插到它原来的前一项后面
    final = insertNew(final, mineList, merged)
    return insertNew(final, theirsList, merged)
  }

  const winnerList = mineReordered ? mineList : theirsList
  const loserList = mineReordered ? theirsList : mineList
  const final = orderOf(winnerList, merged).map(id => merged.get(id)!)
  return insertNew(final, loserList, merged)
}

function orderOf<T extends WithId>(list: T[], merged: Map<string, T>): string[] {
  return list.filter(item => merged.has(item.id)).map(item => item.id)
}

// 把 sideList 里已合并、但尚未进入 final 的新项，插到它在 sideList 中前一个已在 final 的兄弟后面
function insertNew<T extends WithId>(final: T[], sideList: T[], merged: Map<string, T>): T[] {
  const placed = new Set(final.map(item => item.id))
  for (const [idx, item] of sideList.entries()) {
    if (placed.has(item.id) || !merged.has(item.id)) continue
    let insertAt = 0
    for (let i = idx - 1; i >= 0; i--) {
      const pos = final.findIndex(entry => entry.id === sideList[i].id)
      if (pos >= 0) {
        insertAt = pos + 1
        break
      }
    }
    final.splice(insertAt, 0, merged.get(item.id)!)
    placed.add(item.id)
  }
  return final
}

const SLIDE_SCALAR_KEYS: (keyof Slide)[] = [
  'notes', 'remark', 'background', 'animations', 'turningMode', 'sectionTag', 'type',
]

function mergeSlide(base: Slide, mine: Slide, theirs: Slide, path: string, conflicts: string[]): Slide {
  const result: Slide = { ...mine, id: mine.id, elements: [] }
  for (const key of SLIDE_SCALAR_KEYS) {
    const value = mergeValue(base[key], mine[key], theirs[key], `${path}.${String(key)}`, conflicts)
    if (value === undefined) delete result[key]
    else result[key] = value as never
  }
  result.elements = mergeList(base.elements, mine.elements, theirs.elements, `${path}.elements`, mergeElement, conflicts)
  return result
}

function mergeElement<T extends WithId>(base: T, mine: T, theirs: T, path: string, conflicts: string[]): T {
  return mergeValue(base, mine, theirs, path, conflicts)
}
