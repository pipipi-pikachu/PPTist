export interface PPTElementShadow {
  h: number;
  v: number;
  blur: number;
  color: string;
}

export enum ElementTypes {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  LINE = 'line',
  CHART = 'chart',
  TABLE = 'table',
}

export interface PPTElementBaseProps {
  id: string;
  left: number;
  top: number;
  lock?: boolean;
  groupId?: string;
}

export interface PPTElementOutline {
  style?: 'dashed' | 'solid';
  width?: number;
  color?: string;
}

export interface PPTTextElement extends PPTElementBaseProps {
  type: 'text';
  width: number;
  height: number;
  content: string;
  rotate?: number;
  outline?: PPTElementOutline;
  fill?: string;
  opacity?: number;
  shadow?: PPTElementShadow;
}

export interface ImageElementFilters {
  'blur': string;
  'brightness': string;
  'contrast': string;
  'grayscale': string;
  'saturate': string;
  'hue-rotate': string;
  'opacity': string;
}
export interface PPTImageElement extends PPTElementBaseProps {
  type: 'image';
  width: number;
  height: number;
  fixedRatio: boolean;
  src: string;
  rotate?: number;
  outline?: PPTElementOutline;
  filters?: ImageElementFilters;
  clip?: {
    range: [[number, number], [number, number]];
    shape: 'rect' | 'roundRect' | 'ellipse' | 'triangle' | 'pentagon' | 'rhombus' | 'star';
  };
  flip?: { x?: number; y?: number };
  shadow?: PPTElementShadow;
}

export interface PPTShapeElement extends PPTElementBaseProps {
  type: 'shape';
  width: number;
  height: number;
  svgCode: string;
  fixedRatio: boolean;
  fill: string;
  rotate?: number;
  outline?: PPTElementOutline;
  opacity?: number;
  shadow?: PPTElementShadow;
}

export interface PPTLineElement extends PPTElementBaseProps {
  type: 'line';
  start: [number, number];
  end: [number, number];
  width: number;
  style: string;
  color: string;
  points: [string, string];
  lineType: string;
}

export interface PPTChartElement extends PPTElementBaseProps {
  type: 'chart';
  width: number;
  height: number;
  chartType: string;
  data: string;
  outline?: PPTElementOutline;
  theme?: string;
}

export interface TableElementCell {
  colspan: number;
  rowspan: number;
  content: string;
  bgColor: string;
}
export interface PPTTableElement extends PPTElementBaseProps {
  type: 'table';
  width: number;
  height: number;
  borderTheme?: string;
  theme?: string;
  rowSizes: number[];
  colSizes: number[];
  data: TableElementCell[][];
}

export type PPTElement = PPTTextElement | PPTImageElement | PPTShapeElement | PPTLineElement | PPTChartElement | PPTTableElement

export interface PPTAnimation {
  elId: string;
  type: string;
  duration: number;
}

export interface SlideBackground {
  type: 'solid' | 'image';
  value: string;
}

export interface Slide {
  id: string;
  elements: PPTElement[];
  background?: SlideBackground;
  animations?: PPTAnimation[];
}