import { BarChartOptions, LineChartOptions, PieChartOptions } from 'chartist'

export const enum ShapePathFormulasKeys {
  ROUND_RECT = 'roundRect',
  ROUND_RECT_DIAGONAL = 'roundRectDiagonal',
  ROUND_RECT_SINGLE = 'roundRectSingle',
  ROUND_RECT_SAMESIDE = 'roundRectSameSide',
  CUT_RECT_DIAGONAL = 'cutRectDiagonal',
  CUT_RECT_SINGLE = 'cutRectSingle',
  CUT_RECT_SAMESIDE = 'cutRectSameSide',
  CUT_ROUND_RECT = 'cutRoundRect',
  MESSAGE = 'message',
  ROUND_MESSAGE = 'roundMessage',
  L = 'L',
  RING_RECT = 'ringRect',
  PLUS = 'plus',
  TRIANGLE = 'triangle',
  PARALLELOGRAM_LEFT = 'parallelogramLeft',
  PARALLELOGRAM_RIGHT = 'parallelogramRight',
  TRAPEZOID = 'trapezoid',
  BULLET = 'bullet',
  INDICATOR = 'indicator',
}

export const enum ElementTypes {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  LINE = 'line',
  CHART = 'chart',
  TABLE = 'table',
  LATEX = 'latex',
  VIDEO = 'video',
  AUDIO = 'audio',
}
/**
  * element shadow
  *
  * h: horizontal offset
  *
  * v: vertical offset
  *
  * blur: degree of blur
  *
  * color: shadow color
  */
export interface PPTElementShadow {
   h: number
   v: number
   blur: number
   color: string
}

/**
  * element border
  *
  * style?: border style (solid or dashed)
  *
  * width?: border width
  *
  * color?: border color
  */
export interface PPTElementOutline {
   style?: 'dashed' | 'solid'
   width?: number
   color?: string
}

/**
  * element hyperlink
  *
  * type: link type (web page, slide page)
  *
  * target: target address (web link, slide page ID)
  */
export interface PPTElementLink {
   type: 'web' | 'slide'
   target: string
}


/**
  * Element general attributes
  *
  * id: element ID
  *
  * left: The horizontal position of the element (from the left side of the canvas)
  *
  * top: The vertical position of the element (distance from the top of the canvas)
  *
  * lock?: lock element
  *
  * groupId?: Group ID (elements with the same group ID are members of the same group element)
  *
  * width: element width
  *
  * height: element height
  *
  * rotate: rotation angle
  *
  * link?: hyperlink
  *
  * name?: element name
  */
interface PPTBaseElement {
   id: string
   left: number
   top: number
   lock?: boolean
   groupId?: string
   width: number
   height: number
   rotate: number
   link?: PPTElementLink
   name?: string
}


/**
  * text element
  *
  * type: element type (text)
  *
  * content: text content (HTML string)
  *
  * defaultFontName: Default font (will be overridden by HTML inline styles in text content)
  *
  * defaultColor: Default color (will be overridden by HTML inline styles in text content)
  *
  * outline?: border
  *
  * fill?: fill color
  *
  * lineHeight?: Line height (times), default 1.5
  *
  * wordSpace?: Word spacing, default 0
  *
  * opacity?: opacity, default 1
  *
  * shadow?: shadow
  *
  * textIndent?: Indentation of the first line of the paragraph
  *
  * paragraphSpace?: Paragraph spacing, default 5px
  *
  * vertical?: vertical text
  */
export interface PPTTextElement extends PPTBaseElement {
   type: 'text'
   content: string
   defaultFontName: string
   defaultColor: string
   outline?: PPTElementOutline
   fill?: string
   lineHeight?: number
   wordSpace?: number
   opacity?: number
   shadow?: PPTElementShadow
   textIndent?: number
   paragraphSpace?: number
   vertical?: boolean
}


/**
  * Image flipping, shape flipping
  *
  * flipH?: Flip horizontally
  *
  * flipV?: flip vertically
  */
export interface ImageOrShapeFlip {
   flipH?: boolean
   flipV?: boolean
}

/**
  * Image filters
  *
  * https://developer.mozilla.org/en-US/docs/Web/CSS/filter
  *
  * 'blur'?: Blur, default 0 (px)
  *
  * 'brightness'?: Brightness, default 100 (%)
  *
  * 'contrast'?: Contrast, default 100 (%)
  *
  * 'grayscale'?: Grayscale, default 0 (%)
  *
  * 'saturate'?: Saturation, default 100 (%)
  *
  * 'hue-rotate'?: Hue rotation, default 0 (deg)
  *
  * 'opacity'?: Opacity, default 100 (%)
  */
export type ImageElementFilterKeys = 'blur' | 'brightness' | 'contrast' | 'grayscale' | 'saturate' | 'hue-rotate' | 'opacity'
export interface ImageElementFilters {
   'blur'?: string
   'brightness'?: string
   'contrast'?: string
   'grayscale'?: string
   'saturate'?: string
   'hue-rotate'?: string
   'opacity'?: string
}

export type ImageClipDataRange = [[number, number], [number, number]]

/**
  * Image cropping
  *
  * range: cropping range, for example: [[10, 10], [90, 90]] means cropping the range from 10%, 10% to 90%, 90% of the original image from the upper left corner
  *
  * shape: clipping shape, see configs/imageClip.ts CLIPPATHS
  */
export interface ImageElementClip {
   range: ImageClipDataRange
   shape: string
}

/**
  * Image masking
  *
  * color: mask color
  *
  * opacity: mask transparency
  */
export interface ImageColorElementMask {
   color: string
   opacity: number
}

/**
  * Image element
  *
  * type: element type (image)
  *
  * fixedRatio: Fixed image aspect ratio
  *
  * src: image address
  *
  * outline?: border
  *
  * filters?: image filter
  *
  * clip?: clipping information
  *
  * flipH?: Flip horizontally
  *
  * flipV?: flip vertically
  *
  * shadow?: shadow
  */
export interface PPTImageElement extends PPTBaseElement {
   type: 'image'
   fixedRatio: boolean
   src: string
   outline?: PPTElementOutline
   filters?: ImageElementFilters
   clip?: ImageElementClip
   flipH?: boolean
   flipV?: boolean
   shadow?: PPTElementShadow
   colorMask?: ImageColorElementMask
}


/**
  * Shape Gradient
  *
  * type: gradient type (radial, linear)
  *
  * color: gradient color
  *
  * rotate: gradient angle (linear gradient)
  */
export interface ShapeGradient {
   type: 'linear' | 'radial'
   color: [string, string]
   rotate: number
}

/**
  * Text inside the shape
  *
  * content: text content (HTML string)
  *
  * defaultFontName: Default font (will be overridden by HTML inline styles in text content)
  *
  * defaultColor: Default color (will be overridden by HTML inline styles in text content)
  *
  * align: Text alignment direction (vertical direction)
  */
export interface ShapeText {
   content: string
   defaultFontName: string
   defaultColor: string
   align: 'top' | 'middle' | 'bottom'
}

/**
  * Shape elements
  *
  * type: element type (shape)
  *
  * viewBox: viewBox attribute of SVG, for example [1000, 1000] means '0 0 1000 1000'
  *
  * path: shape path, d attribute of SVG path
  *
  * fixedRatio: Fixed shape aspect ratio
  *
  * fill: fill, effective when there is no gradient
  *
  * gradient?: Gradient, when this property exists, it will be filled first
  *
  * outline?: border
  *
  * opacity?: Opacity
  *
  * flipH?: Flip horizontally
  *
  * flipV?: flip vertically
  *
  * shadow?: shadow
  *
  * special?: special shape (marks some difficult-to-parse shapes, for example, if the path uses a type other than L Q C A, this type of shape will become an image after export)
  *
  * text?: Text inside the shape
  *
  * pathFormula?: Shape path calculation formula
  * Under normal circumstances, when the size of the shape changes, only the width and height are adjusted based on the scaling ratio of the viewBox, while the viewBox itself and the path will not change.
  * But there are also some shapes that want to control the position of some key points more precisely. At this time, it is necessary to provide a path calculation formula, and redraw the shape by updating the viewBox and recalculating the path when zooming
  *
  * keypoint?: key point position percentage
  */
export interface PPTShapeElement extends PPTBaseElement {
   type: 'shape'
   viewBox: [number, number]
   path: string
   fixedRatio: boolean
   fill: string
   gradient?: ShapeGradient
   outline?: PPTElementOutline
   opacity?: number
   flipH?: boolean
   flipV?: boolean
   shadow?: PPTElementShadow
   special?: boolean
   text?: ShapeText
   pathFormula?: ShapePathFormulasKeys
   keypoint?: number
}
export type LinePoint = '' | 'arrow' | 'dot' 
/**
  * line element
  *
  * type: element type (line)
  *
  * start: starting position ([x, y])
  *
  * end: End position ([x, y])
  *
  * style: line style (solid line, dashed line)
  *
  * color: line color
  *
  * points: endpoint style ([start style, end style], optional: none, arrow, dot)
  *
  * shadow?: shadow
  *
  * broken?: Polyline control point position ([x, y])
  *
  * curve?: quadratic curve control point position ([x, y])
  *
  * cubic?: Cubic curve control point position ([[x1, y1], [x2, y2]])
  */
export interface PPTLineElement extends Omit<PPTBaseElement, 'height' | 'rotate'> {
  type: 'line'
  start: [number, number]
  end: [number, number]
  style: 'solid' | 'dashed'
  color: string
  points: [LinePoint, LinePoint]
  shadow?: PPTElementShadow
  broken?: [number, number]
  curve?: [number, number]
  cubic?: [[number, number], [number, number]]
}


export type PresetChartType = 'bar' | 'horizontalBar' | 'line' | 'area' | 'scatter' | 'pie' | 'ring'
export type ChartType = 'bar' | 'line' | 'pie'
export type ChartOptions = LineChartOptions & BarChartOptions & PieChartOptions
export interface ChartData {
  labels: string[]
  legends: string[]
  series: number[][]
}

/**
  * Chart elements
  *
  * type: element type (chart)
  *
  * fill?: fill color
  *
  * chartType: basic chart type (bar/line/pie), all chart types are derived from these three basic types
  *
  * data: chart data
  *
  * options?: Chart configuration items
  *
  * outline?: border
  *
  * themeColor: theme color
  *
  * gridColor?: grid & coordinate color
  *
  * legend?: legend/position
  */
export interface PPTChartElement extends PPTBaseElement {
  type: 'chart'
  fill?: string
  chartType: ChartType
  data: ChartData
  options?: ChartOptions
  outline?: PPTElementOutline
  themeColor: string[]
  gridColor?: string
  legend?: '' | 'top' | 'bottom'
}


/**
  * Table cell style
  *
  * bold?: bold
  *
  * em?: italics
  *
  * underline?: underline
  *
  * strikethrough?: strikethrough
  *
  * color?: font color
  *
  * backcolor?: fill color
  *
  * fontsize?: font size
  *
  * fontname?: font
  *
  * align?: alignment
  */
export interface TableCellStyle {
  bold?: boolean
  em?: boolean
  underline?: boolean
  strikethrough?: boolean
  color?: string
  backcolor?: string
  fontsize?: string
  fontname?: string
  align?: 'left' | 'center' | 'right'
}

/**
  * table cell
  *
  * id: Cell ID
  *
  * colspan: the number of merged columns
  *
  * rowspan: the number of merged rows
  *
  * text: text content
  *
  * style?: cell style
  */
export interface TableCell {
  id: string
  colspan: number
  rowspan: number
  text: string
  style?: TableCellStyle
}

/**
  * Form subject
  *
  * color: theme color
  *
  * rowHeader: header row
  *
  * rowFooter: summary row
  *
  * colHeader: the first column
  *
  * colFooter: the last column
  */
export interface TableTheme {
  color: string
  rowHeader: boolean
  rowFooter: boolean
  colHeader: boolean
  colFooter: boolean
}

/**
  * form element
  *
  * type: element type (table)
  *
  * outline: border
  *
  * theme?: theme
  *
  * colWidths: Column width array, such as [30, 50, 20] means that the three column widths are 30%, 50%, 20% respectively
  *
  * cellMinHeight: The minimum height of the cell
  *
  * data: form data
  */
export interface PPTTableElement extends PPTBaseElement {
  type: 'table'
  outline: PPTElementOutline
  theme?: TableTheme
  colWidths: number[]
  cellMinHeight: number
  data: TableCell[][]
}


/**
  * LaTeX element (formula)
  *
  * type: element type (latex)
  *
  * latex: latex code
  *
  * path: svg path
  *
  * color: color
  *
  * strokeWidth: path width
  *
  * viewBox: viewBox property of SVG
  *
  * fixedRatio: Fixed shape aspect ratio
  */
export interface PPTLatexElement extends PPTBaseElement {
  type: 'latex'
  latex: string
  path: string
  color: string
  strokeWidth: number
  viewBox: [number, number]
  fixedRatio: boolean
}

/**
  * Video element
  *
  * type: element type (video)
  *
  * src: Video URL
  *
  * poster: preview cover
  */
export interface PPTVideoElement extends PPTBaseElement {
  type: 'video'
  src: string
  poster?: string
}

/**
 * Audio elements
 *
 * type: element type (audio)
 *
 * fixedRatio: fixed icon width and height ratio
 *
 * color: icon color
 *
 * loop: loop playback
 *
 * autoplay: autoplay
 *
 * src: audio address
 */
export interface PPTAudioElement extends PPTBaseElement {
  type: 'audio'
  fixedRatio: boolean
  color: string,
  loop: boolean,
  autoplay: boolean,
  src: string
}


export type PPTElement = PPTTextElement | PPTImageElement | PPTShapeElement | PPTLineElement | PPTChartElement | PPTTableElement | PPTLatexElement | PPTVideoElement | PPTAudioElement


/**
  * Element animation
  *
  * id: animation id
  *
  * elId: element ID
  *
  * effect: animation effect
  *
  * type: animation type (entry, exit, emphasis)
  *
  * duration: animation duration
  *
  * trigger: animation trigger method (click - when clicked, meantime - at the same time as the previous animation, auto - after the previous animation)
  */
export interface PPTAnimation {
  id: string
  elId: string
  effect: string
  type: 'in' | 'out' | 'attention'
  duration: number
  trigger: 'click' | 'meantime' | 'auto'
}

/**
  * Slide background
  *
  * type: background type (solid color, picture, gradient)
  *
  * color?: background color (solid color)
  *
  * image?: Image address (image)
  *
  * imageSize?: Image filling method
  *
  * gradientType?: Gradient type (linear, radial)
  *
  * gradientColor?: gradient color
  *
  * gradientRotate?: gradient angle (linear)
  */
export interface SlideBackground {
  type: 'solid' | 'image' | 'gradient'
  color?: string
  image?: string
  imageSize?: 'cover' | 'contain' | 'repeat'
  gradientType?: 'linear' | 'radial'
  gradientColor?: [string, string]
  gradientRotate?: number
}


export type TurningMode = 'no' | 'fade' | 'slideX' | 'slideY'

/**
  * Slideshow page
  *
  * id: page ID
  *
  * elements: collection of elements
  *
  * remark?: remark
  *
  * background?: page background
  *
  * animations?: element animation collection
  *
  * turningMode?: page turning mode
  */
export interface Slide {
  id: string
  elements: PPTElement[]
  remark?: string
  background?: SlideBackground
  animations?: PPTAnimation[]
  turningMode?: TurningMode
}

/**
 * Slideshow theme
 *
 * backgroundColor: page background color
 *
 * themeColor: The theme color, used for the shape color created by default, etc.
 *
 * fontColor: font color
 *
 * fontName: font
 */
export interface SlideTheme {
  backgroundColor: string
  themeColor: string
  fontColor: string
  fontName: string
}
