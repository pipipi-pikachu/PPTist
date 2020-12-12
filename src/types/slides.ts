export interface PPTElementBaseProps {
  elId: string;
  isLock: boolean;
  groupId: string;
  left: number;
  top: number;
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
  textType: string;
  content: string;
  rotate?: number;
  fill?: string;
  opactity?: number;
  lineHeight?: number;
  segmentSapcing?: number;
  letterSpacing?: number;
  shadow?: string;
  padding?: number;
}

export interface PPTImageElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  lockRatio: boolean;
  imgUrl: string;
  rotate?: number;
  filter?: string;
  clip?: string;
  flip?: string;
  shadow?: string;
}

export interface PPTShapeElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  svgCode: string;
  lockRatio: boolean;
  fill: string;
  rotate?: number;
  opactity?: number;
  shadow?: string;
  text?: string;
  textAlign?: string;
}

export interface PPTIconElement extends PPTElementBaseProps, PPTElementSizeProps {
  color: string;
  lockRatio: boolean;
  svgCode: string;
  rotate?: number;
  shadow?: string;
}

export interface PPTLineElement extends PPTElementBaseProps {
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
  borderTheme: string;
  theme: string;
  rowSizes: number[];
  colSizes: number[];
  data: TableCell[][];
}
export interface PPTIframeElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
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
  background: [string, string];
  elements: PPTElement[];
  animations: PPTAnimation[];
}