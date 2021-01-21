import { IBarChartOptions, ILineChartOptions, IPieChartOptions } from 'chartist'

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

export interface PPTElementOutline {
  style?: 'dashed' | 'solid';
  width?: number;
  color?: string;
}

export interface PPTTextElement {
  type: 'text';
  id: string;
  left: number;
  top: number;
  lock?: boolean;
  groupId?: string;
  width: number;
  height: number;
  content: string;
  rotate?: number;
  outline?: PPTElementOutline;
  fill?: string;
  lineHeight?: number;
  wordSpace?: number;
  opacity?: number;
  shadow?: PPTElementShadow;
}

export interface ImageElementFilters {
  'blur'?: string;
  'brightness'?: string;
  'contrast'?: string;
  'grayscale'?: string;
  'saturate'?: string;
  'hue-rotate'?: string;
  'opacity'?: string;
}
export interface PPTImageElement {
  type: 'image';
  id: string;
  left: number;
  top: number;
  lock?: boolean;
  groupId?: string;
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

export interface ShapeGradient {
  type: 'linear' | 'radial';
  color: [string, string];
  rotate: number;
}
export interface PPTShapeElement {
  type: 'shape';
  id: string;
  left: number;
  top: number;
  lock?: boolean;
  groupId?: string;
  width: number;
  height: number;
  viewBox: number;
  path: string;
  fixedRatio: boolean;
  fill: string;
  gradient?: ShapeGradient;
  rotate?: number;
  outline?: PPTElementOutline;
  opacity?: number;
  shadow?: PPTElementShadow;
}

export interface PPTLineElement {
  type: 'line';
  id: string;
  left: number;
  top: number;
  lock?: boolean;
  groupId?: string;
  start: [number, number];
  end: [number, number];
  width: number;
  style: string;
  color: string;
  points: [string, string];
  shadow?: PPTElementShadow;
}

export type ChartType = 'bar' | 'line' | 'pie'
export interface ChartData {
  labels: string[];
  series: number[][];
}
export interface PPTChartElement {
  type: 'chart';
  id: string;
  left: number;
  top: number;
  lock?: boolean;
  groupId?: string;
  width: number;
  height: number;
  fill?: string;
  chartType: ChartType;
  data: ChartData;
  options?: ILineChartOptions & IBarChartOptions & IPieChartOptions;
  outline?: PPTElementOutline;
  themeColors?: string[];
  gridColor?: string;
}

export interface TableElementCell {
  colspan: number;
  rowspan: number;
  content: string;
  bgColor: string;
}
export interface PPTTableElement {
  type: 'table';
  id: string;
  left: number;
  top: number;
  lock?: boolean;
  groupId?: string;
  width: number;
  height: number;
  colWidths: number[];
  data: TableElementCell[][];
}

export type PPTElement = PPTTextElement | PPTImageElement | PPTShapeElement | PPTLineElement | PPTChartElement | PPTTableElement

export interface PPTAnimation {
  elId: string;
  type: string;
  duration: number;
}

export interface SlideBackground {
  type: 'solid' | 'image' | 'gradient';
  color?: string;
  image?: string;
  imageSize?: 'cover' | 'contain' | 'repeat' | 'initial';
  gradientType?: 'linear' | 'radial';
  gradientColor?: [string, string];
  gradientRotate?: number;
}

export interface Slide {
  id: string;
  elements: PPTElement[];
  background?: SlideBackground;
  animations?: PPTAnimation[];
  turningMode?: 'no' | 'fade' | 'slideX' | 'slideY';
}