export type ElementType = 'text' | 'image' | 'shape' | 'line' | 'chart' | 'table'

export enum ElementTypes {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  LINE = 'line',
  CHART = 'chart',
  TABLE = 'table',
}

export interface PPTElementBaseProps {
  elId: string;
  left: number;
  top: number;
  isLock?: boolean;
  groupId?: string;
}

export interface PPTElementSizeProps {
  width: number;
  height: number;
}

export interface PPTElementBorderProps {
  borderStyle?: string;
  borderWidth?: number;
  borderColor?: string;
}

export interface PPTTextElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  type: 'text';
  content: string;
  rotate?: number;
  fill?: string;
  opacity?: number;
  lineHeight?: number;
  segmentSpacing?: number;
  letterSpacing?: number;
  shadow?: string;
}

export interface PPTImageElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  type: 'image';
  lockRatio: boolean;
  imgUrl: string;
  rotate?: number;
  filter?: string;
  clip?: {
    range: [[number, number], [number, number]];
    shape: 'rect' | 'roundRect' | 'ellipse' | 'triangle' | 'pentagon' | 'rhombus' | 'star';
  };
  flip?: { x?: number; y?: number };
  shadow?: string;
}

export interface PPTShapeElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  type: 'shape';
  svgCode: string;
  lockRatio: boolean;
  fill: string;
  rotate?: number;
  opacity?: number;
  shadow?: string;
}

export interface PPTLineElement extends PPTElementBaseProps {
  type: 'line';
  start: [number, number];
  end: [number, number];
  width: number;
  style: string;
  color: string;
  marker: [string, string];
  lineType: string;
}

export interface PPTChartElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  type: 'chart';
  chartType: string;
  data: string;
  theme?: string;
}

export interface TableElementCell {
  colspan: number;
  rowspan: number;
  content: string;
  bgColor: string;
}
export interface PPTTableElement extends PPTElementBaseProps, PPTElementSizeProps {
  type: 'table';
  borderTheme?: string;
  theme?: string;
  rowSizes: number[];
  colSizes: number[];
  data: TableElementCell[][];
}

export type PPTElement = PPTTextElement | 
                         PPTImageElement | 
                         PPTShapeElement | 
                         PPTLineElement | 
                         PPTChartElement |
                         PPTTableElement

export interface PPTAnimation {
  elId: string;
  type: string;
  duration: number;
}

export interface Slide {
  id: string;
  elements: PPTElement[];
  background?: [string, string];
  animations?: PPTAnimation[];
}