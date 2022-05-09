export const ANIMATIONS = [
  {
    type: 'bounce',
    name: '弹跳',
    children: [
      { name: '弹入', value: 'bounceIn' },
      { name: '向右弹入', value: 'bounceInLeft' },
      { name: '向左弹入', value: 'bounceInRight' },
      { name: '向上弹入', value: 'bounceInUp' },
      { name: '向下弹入', value: 'bounceInDown' },
    ],
    hiddenElement: []
  },
  {
    type: 'fade',
    name: '浮现',
    children: [
      { name: '浮入', value: 'fadeIn' },
      { name: '向下浮入', value: 'fadeInDown' },
      { name: '向下长距浮入', value: 'fadeInDownBig' },
      { name: '向右浮入', value: 'fadeInLeft' },
      { name: '向右长距浮入', value: 'fadeInLeftBig' },
      { name: '向左浮入', value: 'fadeInRight' },
      { name: '向左长距浮入', value: 'fadeInRightBig' },
      { name: '向上浮入', value: 'fadeInUp' },
      { name: '向上长距浮入', value: 'fadeInUpBig' },
      { name: '从左上浮入', value: 'fadeInTopLeft' },
      { name: '从右上浮入', value: 'fadeInTopRight' },
      { name: '从左下浮入', value: 'fadeInBottomLeft' },
      { name: '从右下浮入', value: 'fadeInBottomRight' },
    ],
    hiddenElement: []
  },
  {
    type: 'rotate',
    name: '旋转',
    children: [
      { name: '旋转进入', value: 'rotateIn' },
      { name: '绕左下旋转进入', value: 'rotateInDownLeft' },
      { name: '绕右下旋转进入', value: 'rotateInDownRight' },
      { name: '绕左上旋转进入', value: 'rotateInUpLeft' },
      { name: '绕右上旋转进入', value: 'rotateInUpRight' },
    ],
    hiddenElement: []
  },
  {
    type: 'zoom',
    name: '缩放',
    children: [
      { name: '放大进入', value: 'zoomIn' },
      { name: '向下放大进入', value: 'zoomInDown' },
      { name: '从左放大进入', value: 'zoomInLeft' },
      { name: '从右放大进入', value: 'zoomInRight' },
      { name: '向上放大进入', value: 'zoomInUp' },
    ],
    hiddenElement: []
  },
  {
    type: 'slide',
    name: '滑入',
    children: [
      { name: '向下滑入', value: 'slideInDown' },
      { name: '从右滑入', value: 'slideInLeft' },
      { name: '从左滑入', value: 'slideInRight' },
      { name: '向上滑入', value: 'slideInUp' },
    ],
    hiddenElement: []
  },
  {
    type: 'flip',
    name: '翻转',
    children: [
      { name: 'X轴翻转进入', value: 'flipInX' },
      { name: 'Y轴翻转进入', value: 'flipInY' },
    ],
    hiddenElement: []
  },
  {
    type: 'back',
    name: '放大滑入',
    children: [
      { name: '向下放大滑入', value: 'backInDown' },
      { name: '从左放大滑入', value: 'backInLeft' },
      { name: '从右放大滑入', value: 'backInRight' },
      { name: '向上放大滑入', value: 'backInUp' },
    ],
    hiddenElement: []
  },
  {
    type: 'lightSpeed',
    name: '飞入',
    children: [
      { name: '从右飞入', value: 'lightSpeedInRight' },
      { name: '从左飞入', value: 'lightSpeedInLeft' },
    ],
    hiddenElement: []
  },
]

export const ANIMATIONS_EXITS = [
  {
    type: 'bounce',
    name: '弹跳',
    children: [
      { name: '弹出', value: 'bounceOut' },
      { name: '向左弹出', value: 'bounceOutLeft' },
      { name: '向右弹出', value: 'bounceOutRight' },
      { name: '向上弹出', value: 'bounceOutUp' },
      { name: '向下弹出', value: 'bounceOutDown' },
    ],
    hiddenElement: []
  },
  {
    type: 'fade',
    name: '浮现',
    children: [
      { name: '浮出', value: 'fadeOut' },
      { name: '向下浮出', value: 'fadeOutDown' },
      { name: '向下长距浮出', value: 'fadeOutDownBig' },
      { name: '向左浮出', value: 'fadeOutLeft' },
      { name: '向左长距浮出', value: 'fadeOutLeftBig' },
      { name: '向右浮出', value: 'fadeOutRight' },
      { name: '向右长距浮出', value: 'fadeOutRightBig' },
      { name: '向上浮出', value: 'fadeOutUp' },
      { name: '向上长距浮出', value: 'fadeOutUpBig' },
      { name: '从左上浮出', value: 'fadeOutTopLeft' },
      { name: '从右上浮出', value: 'fadeOutTopRight' },
      { name: '从左下浮出', value: 'fadeOutBottomLeft' },
      { name: '从右下浮出', value: 'fadeOutBottomRight' },
    ],
    hiddenElement: []
  },
  {
    type: 'rotate',
    name: '旋转',
    children: [
      { name: '旋转退出', value: 'rotateOut' },
      { name: '绕左下旋转退出', value: 'rotateOutDownLeft' },
      { name: '绕右下旋转退出', value: 'rotateOutDownRight' },
      { name: '绕左上旋转退出', value: 'rotateOutUpLeft' },
      { name: '绕右上旋转退出', value: 'rotateOutUpRight' },
    ],
    hiddenElement: []
  },
  {
    type: 'zoom',
    name: '缩放',
    children: [
      { name: '缩小退出', value: 'zoomOut' },
      { name: '向下缩小退出', value: 'zoomOutDown' },
      { name: '从左缩小退出', value: 'zoomOutLeft' },
      { name: '从右缩小退出', value: 'zoomOutRight' },
      { name: '向上缩小退出', value: 'zoomOutUp' },
    ],
    hiddenElement: []
  },
  {
    type: 'slide',
    name: '滑出',
    children: [
      { name: '向下滑出', value: 'slideOutDown' },
      { name: '从左滑出', value: 'slideOutLeft' },
      { name: '从右滑出', value: 'slideOutRight' },
      { name: '向上滑出', value: 'slideOutUp' },
    ],
    hiddenElement: []
  },
  {
    type: 'flip',
    name: '翻转',
    children: [
      { name: 'X轴翻转退出', value: 'flipOutX' },
      { name: 'Y轴翻转退出', value: 'flipOutY' },
    ],
    hiddenElement: []
  },
  {
    type: 'back',
    name: '缩小滑出',
    children: [
      { name: '向下缩小滑出', value: 'backOutDown' },
      { name: '从左缩小滑出', value: 'backOutLeft' },
      { name: '从右缩小滑出', value: 'backOutRight' },
      { name: '向上缩小滑出', value: 'backOutUp' },
    ],
    hiddenElement: []
  },
  {
    type: 'lightSpeed',
    name: '飞出',
    children: [
      { name: '从右飞出', value: 'lightSpeedOutRight' },
      { name: '从左飞出', value: 'lightSpeedOutLeft' },
    ],
    hiddenElement: []
  },
]