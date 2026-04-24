import { t } from '@/i18n';

export const enum KEYS {
  C = 'C',
  X = 'X',
  Z = 'Z',
  Y = 'Y',
  A = 'A',
  G = 'G',
  L = 'L',
  F = 'F',
  D = 'D',
  B = 'B',
  P = 'P',
  O = 'O',
  R = 'R',
  T = 'T',
  MINUS = '-',
  EQUAL = '=',
  DIGIT_0 = '0',
  DELETE = 'DELETE',
  UP = 'ARROWUP',
  DOWN = 'ARROWDOWN',
  LEFT = 'ARROWLEFT',
  RIGHT = 'ARROWRIGHT',
  ENTER = 'ENTER',
  SPACE = ' ',
  TAB = 'TAB',
  BACKSPACE = 'BACKSPACE',
  ESC = 'ESCAPE',
  PAGEUP = 'PAGEUP',
  PAGEDOWN = 'PAGEDOWN',
  F5 = 'F5',
}

interface HotkeyItem {
  type: string
  children: {
    label: string
    value?: string
  }[] 
}

export const HOTKEY_DOC: HotkeyItem[] = [
  {
    type: '通用',
    children: [
      { label: t('Commons.label.text_egv1'), value: 'Ctrl + X' },
      { label: t('Commons.label.text_fljd'), value: 'Ctrl + C' },
      { label: t('Commons.label.text_lyu4'), value: 'Ctrl + V' },
      { label: t('Commons.label.text_xeuxyi'), value: 'Ctrl + Shift + V' },
      { label: t('Commons.label.text_g2mj47'), value: 'Ctrl + D' },
      { label: t('Commons.label.text_emxt'), value: 'Ctrl + A' },
      { label: t('Commons.label.text_hxp8'), value: 'Ctrl + Z' },
      { label: t('Commons.label.text_gvsb'), value: 'Ctrl + Y' },
      { label: t('Commons.label.text_eslg'), value: 'Delete / Backspace' },
      { label: t('Commons.label.text_fy27'), value: '按住 Ctrl 或 Shift' },
      { label: t('Commons.label.text_e25vbq'), value: 'Ctrl + F' },
      { label: t('Commons.label.text_h6kd'), value: 'Ctrl + P' },
      { label: t('Commons.label.text_aw9as8'), value: 'ESC' },
    ],
  },
  {
    type: '幻灯片放映',
    children: [
      { label: t('Commons.label.text_2d3cjk'), value: 'F5' },
      { label: t('Commons.label.text_f2dqm6'), value: 'Shift + F5' },
      { label: t('Commons.label.text_lkdnvg'), value: '↑ / ← / PgUp' },
      { label: t('Commons.label.text_lkdn4r'), value: '↓ / → / PgDown' },
      { label: t('Commons.label.text_lkdn4r'), value: 'Enter / Space' },
      { label: t('Commons.label.text_iicly4'), value: 'ESC' },
    ],
  },
  {
    type: '幻灯片编辑',
    children: [
      { label: t('Commons.label.text_g7l4bb'), value: 'Enter' },
      { label: t('Commons.label.text_fqji7p'), value: 'Space + 鼠标拖拽' },
      { label: t('Commons.label.text_ggs6xp'), value: 'Ctrl + 鼠标滚轮' },
      { label: t('Commons.label.text_d5btzl'), value: 'Ctrl + =' },
      { label: t('Commons.label.text_gffrn2'), value: 'Ctrl + -' },
      { label: t('Commons.label.text_dykekn'), value: 'Ctrl + 0' },
      { label: t('Commons.label.text_34hwbr'), value: '↑' },
      { label: t('Commons.label.text_4i2gq'), value: '↓' },
      { label: t('Commons.label.text_btlof'), value: '鼠标上滚 / PgUp' },
      { label: t('Commons.label.text_btmf4'), value: '鼠标下滚 / PgDown' },
      { label: t('Commons.label.text_gwenag'), value: '双击空白处 / T' },
      { label: t('Commons.label.text_gwbk9g'), value: 'R' },
      { label: t('Commons.label.text_gwh5n5'), value: 'O' },
      { label: t('Commons.label.text_gwactn'), value: 'L' },
      { label: t('Commons.label.text_xac2xv'), value: '鼠标右键' },
    ],
  },
  {
    type: '元素操作',
    children: [
      { label: t('Commons.label.text_l79p'), value: '↑ / ← / ↓ / →' },
      { label: t('Commons.label.text_puih'), value: 'Ctrl + L' },
      { label: t('Commons.label.text_m0uc'), value: 'Ctrl + G' },
      { label: t('Commons.label.text_b1blbq'), value: 'Ctrl + Shift + G' },
      { label: t('Commons.label.text_jedfe'), value: 'Alt + F' },
      { label: t('Commons.label.text_j4j0b'), value: 'Alt + B' },
      { label: t('Commons.label.text_y11tgr'), value: '按住 Ctrl 或 Shift' },
      { label: t('Commons.label.text_cp2ijh'), value: '按住 Ctrl + 拖拽' },
      { label: t('Configs.Hotkey.label.text_60jfmh'), value: '按住 Ctrl 或 Shift' },
      { label: t('Commons.label.text_opkc51'), value: 'Tab' },
      { label: t('Commons.label.text_p27zbc'), value: 'Enter' },
      { label: t('Commons.label.text_j0cimf'), value: 'Enter' },
    ],
  },
  {
    type: '表格编辑',
    children: [
      { label: t('Commons.label.text_upf4ot'), value: 'Tab' },
      { label: t('Commons.label.text_bvakb2'), value: '↑ / ← / ↓ / →' },
      { label: t('Commons.label.text_wj3dva'), value: 'Ctrl + ↑' },
      { label: t('Commons.label.text_x0509h'), value: 'Ctrl + ↓' },
      { label: t('Commons.label.text_lqho43'), value: 'Ctrl + ←' },
      { label: t('Commons.label.text_nbn7fq'), value: 'Ctrl + →' },
    ],
  },
  {
    type: '图表数据编辑',
    children: [
      { label: t('Commons.label.text_sju1rn'), value: 'Enter' },
    ],
  },
  {
    type: '文本编辑',
    children: [
      { label: t('Commons.label.text_eqk7'), value: 'Ctrl + B' },
      { label: t('Commons.label.text_hpvb'), value: 'Ctrl + I' },
      { label: t('Commons.label.text_bu69k'), value: 'Ctrl + U' },
      { label: t('Commons.label.text_hj7bp3'), value: 'Ctrl + E' },
      { label: t('Commons.label.text_c3if3'), value: 'Ctrl + ;' },
      { label: t('Commons.label.text_c3j5s'), value: `Ctrl + '` },
      { label: t('Commons.label.text_ihzkvg'), value: `ESC` },
    ],
  },
  {
    type: '其他快捷操作',
    children: [
      { label: t('Configs.Hotkey.label.text_d1004e') },
      { label: t('Configs.Hotkey.label.text_nji20m') },
      { label: t('Configs.Hotkey.label.svg') },
      { label: t('Configs.Hotkey.label.pexels') },
      { label: t('Configs.Hotkey.label.text_fb740d') },
      { label: t('Configs.Hotkey.label.text_2j3m81') },
      { label: t('Configs.Hotkey.label.markdown') },
    ],
  },
]