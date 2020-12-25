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

export type OperateResizeHandler = 'left-top' |
                                       'top' |
                                       'right-top' |
                                       'left' |
                                       'right' |
                                       'left-bottom' |
                                       'bottom' |
                                       'right-bottom'

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