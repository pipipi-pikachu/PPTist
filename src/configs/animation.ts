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
  },
  {
    type: 'flip',
    name: '翻转',
    children: [
      { name: 'X轴翻转进入', value: 'flipInX' },
      { name: 'Y轴翻转进入', value: 'flipInY' },
    ],
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
  },
  {
    type: 'lightSpeed',
    name: '飞入',
    children: [
      { name: '从右飞入', value: 'lightSpeedInRight' },
      { name: '从左飞入', value: 'lightSpeedInLeft' },
    ],
  },
]