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

export type ElementScaleHandler = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type OperateBorderLineType = 't' | 'b' | 'l' | 'r'

export enum OperateBorderLineTypes {
  T = 't',
  B = 'b',
  L = 'l',
  R = 'r',
}

export type OperateResizablePointType = 't-l' | 't-c' | 't-r' | 'm-l' | 'm-r' | 'b-l' | 'b-c' | 'b-r' | 'any'

export enum OperateResizablePointTypes {
  TL = 't-l',
  TC = 't-c',
  TR = 't-r',
  ML = 'm-l',
  MR = 'm-r',
  BL = 'b-l',
  BC = 'b-c',
  BR = 'b-r',
  ANY = 'any',
}

export enum OperatePoints {
  LEFT_TOP = 1,
  TOP = 2,
  RIGHT_TOP = 3,
  LEFT = 4,
  RIGHT = 5,
  LEFT_BOTTOM = 6,
  BOTTOM = 7,
  RIGHT_BOTTOM = 8,
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