import { ShapePoolItem } from '@/configs/shapes'
import { LinePoolItem } from '@/configs/lines'
import { ImageClipDataRange } from './slides'

export enum ElementOrderCommands {
  UP = 'up',
  DOWN = 'down',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export enum ElementAlignCommands {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  CENTER = 'center',
}

export const enum OperateBorderLines {
  T = 'top',
  B = 'bottom',
  L = 'left',
  R = 'right',
}

export const enum OperateResizeHandlers {
  LEFT_TOP = 'left-top',
  TOP = 'top',
  RIGHT_TOP = 'right-top',
  LEFT = 'left',
  RIGHT = 'right',
  LEFT_BOTTOM = 'left-bottom',
  BOTTOM = 'bottom',
  RIGHT_BOTTOM = 'right-bottom',
}

export const enum OperateLineHandlers {
  START = 'start',
  END = 'end',
  C = 'ctrl',
  C1 = 'ctrl1',
  C2 = 'ctrl2',
}

export interface AlignmentLineAxis {
  x: number
  y: number
}

export interface AlignmentLineProps {
  type: 'vertical' | 'horizontal'
  axis: AlignmentLineAxis
  length: number
}

export interface MultiSelectRange {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export interface ImageClipedEmitData {
  range: ImageClipDataRange
  position: {
    left: number
    top: number
    width: number
    height: number
  }
}

export interface CreateElementSelectionData {
  start: [number, number]
  end: [number, number]
}

export interface CreatingTextElement {
  type: 'text'
  vertical?: boolean
}
export interface CreatingShapeElement {
  type: 'shape'
  data: ShapePoolItem
}
export interface CreatingLineElement {
  type: 'line'
  data: LinePoolItem
}
export type CreatingElement = CreatingTextElement | CreatingShapeElement | CreatingLineElement

export interface TextFormatPainter {
  bold?: boolean
  em?: boolean
  underline?: boolean
  strikethrough?: boolean
  color?: string
  backcolor?: string
  fontsize?: string
  fontname?: string
  align?: 'left' | 'right' | 'center'
}