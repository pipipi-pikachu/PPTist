import { IBarChartOptions, ILineChartOptions, IPieChartOptions } from 'chartist'

export interface PPTElementShadow {
  h: number;
  v: number;
  blur: number;
  color: string;
}

export const enum ElementTypes {
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

interface PPTBaseElement {
  id: string;
  left: number;
  top: number;
  lock?: boolean;
  groupId?: string;
  width: number;
  height: number;
}

export interface PPTTextElement extends PPTBaseElement {
  type: 'text';
  content: string;
  rotate: number;
  outline?: PPTElementOutline;
  fill?: string;
  lineHeight?: number;
  wordSpace?: number;
  opacity?: number;
  shadow?: PPTElementShadow;
}

export interface ImageOrShapeFlip {
  x?: number;
  y?: number;
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
export interface ImageElementClip {
  range: [[number, number], [number, number]];
  shape: string;
}
export interface PPTImageElement extends PPTBaseElement {
  type: 'image';
  fixedRatio: boolean;
  src: string;
  rotate: number;
  outline?: PPTElementOutline;
  filters?: ImageElementFilters;
  clip?: ImageElementClip;
  flip?: ImageOrShapeFlip;
  shadow?: PPTElementShadow;
}

export interface ShapeGradient {
  type: 'linear' | 'radial';
  color: [string, string];
  rotate: number;
}
export interface PPTShapeElement extends PPTBaseElement {
  type: 'shape';
  viewBox: number;
  path: string;
  fixedRatio: boolean;
  fill: string;
  gradient?: ShapeGradient;
  rotate: number;
  outline?: PPTElementOutline;
  opacity?: number;
  flip?: ImageOrShapeFlip;
  shadow?: PPTElementShadow;
}

export interface PPTLineElement extends Omit<PPTBaseElement, 'height'> {
  type: 'line';
  start: [number, number];
  end: [number, number];
  style: string;
  color: string;
  points: [string, string];
  shadow?: PPTElementShadow;
  broken?: [number, number];
  curve?: [number, number];
}

export type ChartType = 'bar' | 'line' | 'pie'
export interface ChartData {
  labels: string[];
  series: number[][];
}
export interface PPTChartElement extends PPTBaseElement {
  type: 'chart';
  fill?: string;
  chartType: ChartType;
  data: ChartData;
  options?: ILineChartOptions & IBarChartOptions & IPieChartOptions;
  outline?: PPTElementOutline;
  themeColor: string;
  gridColor?: string;
}

export interface TableCellStyle {
  bold?: boolean;
  em?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: string;
  backcolor?: string;
  fontsize?: string;
  fontname?: string;
  align?: string;
}
export interface TableCell {
  id: string;
  colspan: number;
  rowspan: number;
  text: string;
  style?: TableCellStyle;
}
export interface TableTheme {
  color: string;
  rowHeader: boolean;
  rowFooter: boolean;
  colHeader: boolean;
  colFooter: boolean;
} 
export interface PPTTableElement extends PPTBaseElement {
  type: 'table';
  outline: PPTElementOutline;
  theme?: TableTheme;
  colWidths: number[];
  data: TableCell[][];
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
  remark?: string;
  background?: SlideBackground;
  animations?: PPTAnimation[];
  turningMode?: 'no' | 'fade' | 'slideX' | 'slideY';
}

export interface SlideTheme {
  backgroundColor: string;
  themeColor: string;
  fontColor: string;
  fontName: string;
}