import { t } from '@/i18n';

export const ELEMENT_TYPE_ZH: Record<string, string> = {
  text: t('Commons.text.text_hu2t'),
  image: t('Commons.text.text_ff9l'),
  shape: t('Commons.text.text_guqc'),
  line: t('Commons.text.text_m4jm'),
  chart: t('Commons.text.text_fjmy'),
  table: t('Commons.text.text_nrv8'),
  video: t('Commons.text.text_o9sb'),
  audio: t('Commons.text.text_qola'),
  latex: t('Commons.text.text_edcz'),
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