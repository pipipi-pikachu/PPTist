import type { CSSProperties } from 'vue'
import { round } from 'lodash'
import type { PptTextBoxInset } from '@/types/slides'

/** pptxtojson 解析得到的 a:bodyPr 边距（pt） */
export type PptxParsedTextInset = { l: number; t: number; r: number; b: number }

/** 4位小数 */
const INSET_DECIMALS = 4
export function roundInsetPx(value: number): number {
  return round(Math.max(0, value), INSET_DECIMALS)
}

/** 解析边距（与幻灯片同一套 `layoutRatio`）换算为画布 px；全零则 `undefined` */
export function pptxTextInsetToCanvas(
  inset: PptxParsedTextInset | undefined,
  layoutRatio: number,
): PptTextBoxInset | undefined {
  if (!inset) return undefined
  const o: PptTextBoxInset = {
    l: roundInsetPx(inset.l * layoutRatio),
    t: roundInsetPx(inset.t * layoutRatio),
    r: roundInsetPx(inset.r * layoutRatio),
    b: roundInsetPx(inset.b * layoutRatio),
  }
  if (o.l === 0 && o.t === 0 && o.r === 0 && o.b === 0) return undefined
  return o
}

/**
 * 导入 PPTX 时：把解析得到的 bodyPr 边距换算为画布 px，供对象展开。
 * 无有效内边距时返回空对象。
 */
export function pptxTextInsetToCanvasProps(
  source: { textInset?: PptxParsedTextInset },
  layoutRatio: number,
): { textInset: PptTextBoxInset } | Record<string, never> {
  const canvasInset = pptxTextInsetToCanvas(source.textInset, layoutRatio)
  return canvasInset ? { textInset: canvasInset } : {}
}

/** 供样式面板同步四边输入框（已 round） */
export function insetQuadRoundedFromOptional(ins: PptTextBoxInset | undefined) {
  return {
    t: roundInsetPx(ins?.t ?? 0),
    r: roundInsetPx(ins?.r ?? 0),
    b: roundInsetPx(ins?.b ?? 0),
    l: roundInsetPx(ins?.l ?? 0),
  }
}

/** 文本/形状内文字容器上与 CSS `padding` 一致的样式（上右下左） */
export function pptTextBoxInsetToElementContentStyle(inset: PptTextBoxInset | undefined): CSSProperties {
  if (!inset) return {}
  return {
    padding: `${inset.t}px ${inset.r}px ${inset.b}px ${inset.l}px`,
    boxSizing: 'border-box',
    minWidth: 0,
  }
}

/**
 * pptxgenjs 3.x `margin`：单位 pt；数组顺序为 **[left, right, bottom, top]**（见库内 → lIns/rIns/bIns/tIns），与类型注释里的 TRBL 不同。
 * @param ratioPx2Pt 画布 px 折算为 pt 的除数（与 useExport 中一致）
 */
export function canvasTextInsetToPptxMargin(
  inset: PptTextBoxInset | undefined,
  ratioPx2Pt: number,
): number | [number, number, number, number] {
  if (!inset) return 0
  const { l, t, r, b } = inset
  if (l === 0 && t === 0 && r === 0 && b === 0) return 0
  return [
    round(l / ratioPx2Pt, INSET_DECIMALS),
    round(r / ratioPx2Pt, INSET_DECIMALS),
    round(b / ratioPx2Pt, INSET_DECIMALS),
    round(t / ratioPx2Pt, INSET_DECIMALS),
  ]
}

/** 合并单边修改；全为 0 时返回 undefined（从元素上省略 textInset） */
export function mergePptTextBoxInset(
  current: PptTextBoxInset | undefined,
  patch: Partial<PptTextBoxInset>,
): PptTextBoxInset | undefined {
  const n: PptTextBoxInset = {
    l: roundInsetPx(patch.l !== undefined ? patch.l : (current?.l ?? 0)),
    t: roundInsetPx(patch.t !== undefined ? patch.t : (current?.t ?? 0)),
    r: roundInsetPx(patch.r !== undefined ? patch.r : (current?.r ?? 0)),
    b: roundInsetPx(patch.b !== undefined ? patch.b : (current?.b ?? 0)),
  }
  if (n.l === 0 && n.t === 0 && n.r === 0 && n.b === 0) return undefined
  return n
}
