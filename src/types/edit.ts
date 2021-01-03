import { ShapePoolItem } from '@/configs/shapes'
import { LinePoolItem } from '@/configs/lines'

export type ElementOrderCommand = 'up' | 'down' | 'top' | 'bottom'

export enum ElementOrderCommands {
  UP = 'up',
  DOWN = 'down',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export type ElementAlignCommand = 'top'| 'bottom' | 'left' | 'right' | 'vertical' | 'horizontal'

export enum ElementAlignCommands {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export type OperateBorderLine = 'top' | 'bottom' | 'left' | 'right'

export enum OperateBorderLines {
  T = 'top',
  B = 'bottom',
  L = 'left',
  R = 'right',
}

export type OperateResizeHandler = '' | 'left-top' | 'top' | 'right-top' | 'left' | 'right' | 'left-bottom' | 'bottom' | 'right-bottom'

export enum OperateResizeHandlers {
  LEFT_TOP = 'left-top',
  TOP = 'top',
  RIGHT_TOP = 'right-top',
  LEFT = 'left',
  RIGHT = 'right',
  LEFT_BOTTOM = 'left-bottom',
  BOTTOM = 'bottom',
  RIGHT_BOTTOM = 'right-bottom',
}

export type OperateLineHandler = 'start' | 'end'

export enum OperateLineHandlers {
  START = 'start',
  END = 'end,'
}

export interface AlignmentLineAxis {
  x: number; 
  y: number;
}

export interface AlignmentLineProps {
  type: 'vertical' | 'horizontal';
  axis: AlignmentLineAxis;
  length: number;
}

export interface MultiSelectRange {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export type ImageClipDataRange = [[number, number], [number, number]]

export interface ImageClipData {
  range: ImageClipDataRange;
  path: string;
}

export interface ImageClipedEmitData {
  range: ImageClipDataRange;
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

export interface CreateElementSelectionData {
  start: [number, number];
  end: [number, number];
}

export interface CreatingTextElement {
  type: 'text';
}
export interface CreatingShapeElement {
  type: 'shape';
  data: ShapePoolItem;
}
export interface CreatingLineElement {
  type: 'line';
  data: LinePoolItem;
}
export type CreatingElement = CreatingTextElement | CreatingShapeElement | CreatingLineElement