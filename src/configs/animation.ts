import { t } from '@/i18n'
import type { TurningMode } from '@/types/slides'

export const ANIMATION_DEFAULT_DURATION = 1000
export const ANIMATION_DEFAULT_TRIGGER = 'click'
export const ANIMATION_CLASS_PREFIX = 'animate__'

export const ENTER_ANIMATIONS = [
  {
    type: 'bounce',
    name: t('弹跳'),
    children: [
      { name: t('弹入'), value: 'bounceIn' },
      { name: t('向右弹入'), value: 'bounceInLeft' },
      { name: t('向左弹入'), value: 'bounceInRight' },
      { name: t('向上弹入'), value: 'bounceInUp' },
      { name: t('向下弹入'), value: 'bounceInDown' },
    ],
  },
  {
    type: 'fade',
    name: t('浮现'),
    children: [
      { name: t('浮入'), value: 'fadeIn' },
      { name: t('向下浮入'), value: 'fadeInDown' },
      { name: t('向下长距浮入'), value: 'fadeInDownBig' },
      { name: t('向右浮入'), value: 'fadeInLeft' },
      { name: t('向右长距浮入'), value: 'fadeInLeftBig' },
      { name: t('向左浮入'), value: 'fadeInRight' },
      { name: t('向左长距浮入'), value: 'fadeInRightBig' },
      { name: t('向上浮入'), value: 'fadeInUp' },
      { name: t('向上长距浮入'), value: 'fadeInUpBig' },
      { name: t('从左上浮入'), value: 'fadeInTopLeft' },
      { name: t('从右上浮入'), value: 'fadeInTopRight' },
      { name: t('从左下浮入'), value: 'fadeInBottomLeft' },
      { name: t('从右下浮入'), value: 'fadeInBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: t('旋转'),
    children: [
      { name: t('旋转进入'), value: 'rotateIn' },
      { name: t('绕左下进入'), value: 'rotateInDownLeft' },
      { name: t('绕右下进入'), value: 'rotateInDownRight' },
      { name: t('绕左上进入'), value: 'rotateInUpLeft' },
      { name: t('绕右上进入'), value: 'rotateInUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: t('缩放'),
    children: [
      { name: t('放大进入'), value: 'zoomIn' },
      { name: t('向下放大进入'), value: 'zoomInDown' },
      { name: t('从左放大进入'), value: 'zoomInLeft' },
      { name: t('从右放大进入'), value: 'zoomInRight' },
      { name: t('向上放大进入'), value: 'zoomInUp' },
    ],
  },
  {
    type: 'slide',
    name: t('滑入'),
    children: [
      { name: t('向下滑入'), value: 'slideInDown' },
      { name: t('从右滑入'), value: 'slideInLeft' },
      { name: t('从左滑入'), value: 'slideInRight' },
      { name: t('向上滑入'), value: 'slideInUp' },
    ],
  },
  {
    type: 'flip',
    name: t('翻转'),
    children: [
      { name: t('X轴翻转进入'), value: 'flipInX' },
      { name: t('Y轴翻转进入'), value: 'flipInY' },
    ],
  },
  {
    type: 'back',
    name: t('放大滑入'),
    children: [
      { name: t('向下放大滑入'), value: 'backInDown' },
      { name: t('从左放大滑入'), value: 'backInLeft' },
      { name: t('从右放大滑入'), value: 'backInRight' },
      { name: t('向上放大滑入'), value: 'backInUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: t('飞入'),
    children: [
      { name: t('从右飞入'), value: 'lightSpeedInRight' },
      { name: t('从左飞入'), value: 'lightSpeedInLeft' },
    ],
  },
]

export const EXIT_ANIMATIONS = [
  {
    type: 'bounce',
    name: t('弹跳'),
    children: [
      { name: t('弹出'), value: 'bounceOut' },
      { name: t('向左弹出'), value: 'bounceOutLeft' },
      { name: t('向右弹出'), value: 'bounceOutRight' },
      { name: t('向上弹出'), value: 'bounceOutUp' },
      { name: t('向下弹出'), value: 'bounceOutDown' },
    ],
  },
  {
    type: 'fade',
    name: t('浮现'),
    children: [
      { name: t('浮出'), value: 'fadeOut' },
      { name: t('向下浮出'), value: 'fadeOutDown' },
      { name: t('向下长距浮出'), value: 'fadeOutDownBig' },
      { name: t('向左浮出'), value: 'fadeOutLeft' },
      { name: t('向左长距浮出'), value: 'fadeOutLeftBig' },
      { name: t('向右浮出'), value: 'fadeOutRight' },
      { name: t('向右长距浮出'), value: 'fadeOutRightBig' },
      { name: t('向上浮出'), value: 'fadeOutUp' },
      { name: t('向上长距浮出'), value: 'fadeOutUpBig' },
      { name: t('从左上浮出'), value: 'fadeOutTopLeft' },
      { name: t('从右上浮出'), value: 'fadeOutTopRight' },
      { name: t('从左下浮出'), value: 'fadeOutBottomLeft' },
      { name: t('从右下浮出'), value: 'fadeOutBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: t('旋转'),
    children: [
      { name: t('旋转退出'), value: 'rotateOut' },
      { name: t('绕左下退出'), value: 'rotateOutDownLeft' },
      { name: t('绕右下退出'), value: 'rotateOutDownRight' },
      { name: t('绕左上退出'), value: 'rotateOutUpLeft' },
      { name: t('绕右上退出'), value: 'rotateOutUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: t('缩放'),
    children: [
      { name: t('缩小退出'), value: 'zoomOut' },
      { name: t('向下缩小退出'), value: 'zoomOutDown' },
      { name: t('从左缩小退出'), value: 'zoomOutLeft' },
      { name: t('从右缩小退出'), value: 'zoomOutRight' },
      { name: t('向上缩小退出'), value: 'zoomOutUp' },
    ],
  },
  {
    type: 'slide',
    name: t('滑出'),
    children: [
      { name: t('向下滑出'), value: 'slideOutDown' },
      { name: t('从左滑出'), value: 'slideOutLeft' },
      { name: t('从右滑出'), value: 'slideOutRight' },
      { name: t('向上滑出'), value: 'slideOutUp' },
    ],
  },
  {
    type: 'flip',
    name: t('翻转'),
    children: [
      { name: t('X轴翻转退出'), value: 'flipOutX' },
      { name: t('Y轴翻转退出'), value: 'flipOutY' },
    ],
  },
  {
    type: 'back',
    name: t('缩小滑出'),
    children: [
      { name: t('向下缩小滑出'), value: 'backOutDown' },
      { name: t('从左缩小滑出'), value: 'backOutLeft' },
      { name: t('从右缩小滑出'), value: 'backOutRight' },
      { name: t('向上缩小滑出'), value: 'backOutUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: t('飞出'),
    children: [
      { name: t('从右飞出'), value: 'lightSpeedOutRight' },
      { name: t('从左飞出'), value: 'lightSpeedOutLeft' },
    ],
  },
]

export const ATTENTION_ANIMATIONS = [
  {
    type: 'shake',
    name: t('晃动'),
    children: [
      { name: t('左右摇晃'), value: 'shakeX' },
      { name: t('上下摇晃'), value: 'shakeY' },
      { name: t('摇头'), value: 'headShake' },
      { name: t('摆动'), value: 'swing' },
      { name: t('晃动'), value: 'wobble' },
      { name: t('惊恐'), value: 'tada' },
      { name: t('果冻'), value: 'jello' },
    ],
  },
  {
    type: 'other',
    name: t('其他'),
    children: [
      { name: t('弹跳'), value: 'bounce' },
      { name: t('闪烁'), value: 'flash' },
      { name: t('脉搏'), value: 'pulse' },
      { name: t('橡皮筋'), value: 'rubberBand' },
      { name: t('心跳（快）'), value: 'heartBeat' },
    ],
  },
]

interface SlideAnimation {
  label: string
  value: TurningMode
}

export const SLIDE_ANIMATIONS: SlideAnimation[] = [
  { label: t('无'), value: 'no' },
  { label: t('随机'), value: 'random' },
  { label: t('左右推移'), value: 'slideX' },
  { label: t('上下推移'), value: 'slideY' },
  { label: t('左右推移（3D）'), value: 'slideX3D' },
  { label: t('上下推移（3D）'), value: 'slideY3D' },
  { label: t('淡入淡出'), value: 'fade' },
  { label: t('旋转'), value: 'rotate' },
  { label: t('上下展开'), value: 'scaleY' },
  { label: t('左右展开'), value: 'scaleX' },
  { label: t('放大'), value: 'scale' },
  { label: t('缩小'), value: 'scaleReverse' },
  { label: t('左右擦除'), value: 'wipeX' },
  { label: t('上下擦除'), value: 'wipeY' },
  { label: t('圆形展开'), value: 'circle' },
  { label: t('菱形展开'), value: 'diamond' },
  { label: t('左上右下推移'), value: 'slideDiagonal' },
  { label: t('右上左下推移'), value: 'slideDiagonalReverse' },
  { label: t('横向中心揭幕'), value: 'revealX' },
  { label: t('纵向中心揭幕'), value: 'revealY' },
  { label: t('水平翻转展开'), value: 'flipY' },
  { label: t('垂直翻转展开'), value: 'flipX' },
]