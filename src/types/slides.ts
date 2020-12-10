interface PPTElementBaseProps {
  id: string;
  isLock: boolean;
  groupId: string;
  left: number;
  top: number;
}

interface PPTElementSizeProps {
  width: number;
  height: number;
}

interface PPTElementBorderProps {
  borderStyle: string;
  borderWidth: number;
  borderColor: string;
}

interface PPTTextElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  rotate: number;
  fill: string;
  opactity: number;
  lineHeight: number;
  segmentSapcing: number;
  letterSpacing: number;
  shadow: string;
  padding: number;
  textType: string;
  content: string;
}

interface PPTImageElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  rotate: number;
  filter: string;
  clip: string;
  flip: string;
  shadow: string;
  lockRatio: boolean;
  imgUrl: string;
}

interface PPTShapeElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  rotate: number;
  fill: string;
  opactity: number;
  shadow: string;
  lockRatio: boolean;
  svgCode: string;
  text: string;
  textAlign: string;
}

interface PPTIconElement extends PPTElementBaseProps, PPTElementSizeProps {
  rotate: number;
  color: string;
  shadow: string;
  lockRatio: boolean;
  svgCode: string;
}

interface PPTLineElement extends PPTElementBaseProps {
  start: number[];
  end: number[];
  width: number;
  style: string;
  color: string;
  marker: string[];
  lineType: string;
}

interface BarChartSeries {
  name: string;
  data: number[];
}
interface BarChartData {
  axisData: string[];
  series: BarChartSeries[];
}
interface PieChartData {
  name: string;
  value: number
}
interface PPTChartElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  chartType: string;
  theme: string;
  data: PieChartData[] | BarChartData;
}

interface TableCell {
  colspan: number;
  rowspan: number;
  content: string;
  bgColor: string;
}
interface PPTTableElement extends PPTElementBaseProps, PPTElementSizeProps {
  borderTheme: string;
  theme: string;
  rowSizes: number[];
  colSizes: number[];
  data: TableCell[][];
}
interface PPTIframeElement extends PPTElementBaseProps, PPTElementSizeProps, PPTElementBorderProps {
  src: string;
}

type PPTElement = PPTTextElement | 
                  PPTImageElement | 
                  PPTShapeElement | 
                  PPTIconElement | 
                  PPTLineElement | 
                  PPTChartElement |
                  PPTTableElement |
                  PPTIframeElement

interface PPTAnimation {
  elId: string;
  type: string;
  duration: number;
}

interface Slide {
  id: string;
  elements: PPTElement[];
  animations: PPTAnimation[];
}