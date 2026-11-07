import { t } from '@/i18n'
export const ELEMENT_TYPE_ZH: Record<string, string> = {
  text: t('文本'),
  image: t('图片'),
  shape: t('形状'),
  line: t('线条'),
  chart: t('图表'),
  table: t('表格'),
  video: t('视频'),
  audio: t('音频'),
  latex: t('公式'),
}

export const MIN_SIZE: Record<string, number> = {
  text: 40,
  image: 20,
  shape: 20,
  chart: 200,
  table: 30,
  video: 250,
  audio: 20,
  latex: 20,
}