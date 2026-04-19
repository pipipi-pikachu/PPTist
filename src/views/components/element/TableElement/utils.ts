import type { CSSProperties } from 'vue'
import type { PPTElementOutline, TableCellStyle } from '@/types/slides'

/**
 * 计算单元格样式
 * @param style 单元格文本样式原数据
 */
export const getCellStyle = (outline: PPTElementOutline, style?: TableCellStyle): CSSProperties => {
  if (!style) return {}
  
  return {
    backgroundColor: style.backcolor || '',
    borderStyle: outline.style,
    borderColor: outline.color,
    borderWidth: outline.width + 'px',
  }
}

/**
 * 计算单元格文本样式
 * @param style 单元格文本样式原数据
 */
export const getTextStyle = (cellMinHeight: number, style?: TableCellStyle): CSSProperties => {
  if (!style) return {}

  const {
    bold,
    em,
    underline,
    strikethrough,
    color,
    fontsize,
    fontname,
    align,
    vAlign,
  } = style

  const vAlignMap = {
    'top': 'flex-start',
    'middle': 'center',
    'bottom': 'flex-end',
  }

  let textDecoration = `${underline ? 'underline' : ''} ${strikethrough ? 'line-through' : ''}`
  if (textDecoration === ' ') textDecoration = 'none'
  
  return {
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: em ? 'italic' : 'normal',
    textDecoration,
    color: color || '#000',
    fontSize: fontsize || '14px',
    fontFamily: fontname || '',
    justifyContent: vAlignMap[vAlign || 'top'],
    textAlign: align || 'left',
    minHeight: (cellMinHeight - 4) + 'px',
  }
}

export const formatText = (text: string) => {
  return text.replace(/\n/g, '</br>').replace(/ /g, '&nbsp;')
}