export interface PPTElementBaseProps {
  elId: string;
  isLock: boolean;
  left: number;
  top: number;
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
  textType: string;
  content: string;
  rotate?: number;
  fill?: string;
  opacity?: number;
  lineHeight?: number;
  segmentSpacing?: number;
  letterSpacing?: number;
  shadow?: string;
  padding?: number;
}

interface ImageClip {
  range: [[number, number], [number, number]];
  shape: string;
}
export interface PPTImageElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  type: 'image';
  lockRatio: boolean;
  imgUrl: string;
  rotate?: number;
  filter?: string;
  clip?: ImageClip;
  flip?: string;
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
  text?: string;
  textAlign?: string;
}

export interface PPTIconElement extends PPTElementBaseProps, PPTElementSizeProps {
  type: 'icon';
  color: string;
  lockRatio: boolean;
  svgCode: string;
  rotate?: number;
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

export interface BarChartSeries {
  name: string;
  data: number[];
}
export interface BarChartData {
  axisData: string[];
  series: BarChartSeries[];
}
export interface PieChartData {
  name: string;
  value: number
}
export interface PPTChartElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  type: 'chart';
  chartType: string;
  theme: string;
  data: PieChartData[] | BarChartData;
}

export interface TableCell {
  colspan: number;
  rowspan: number;
  content: string;
  bgColor: string;
}
export interface PPTTableElement extends PPTElementBaseProps, PPTElementSizeProps {
  type: 'table';
  borderTheme: string;
  theme: string;
  rowSizes: number[];
  colSizes: number[];
  data: TableCell[][];
}
export interface PPTIframeElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  type: 'iframe';
  src: string;
}

export type PPTElement = PPTTextElement | 
                         PPTImageElement | 
                         PPTShapeElement | 
                         PPTIconElement | 
                         PPTLineElement | 
                         PPTChartElement |
                         PPTTableElement |
                         PPTIframeElement

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