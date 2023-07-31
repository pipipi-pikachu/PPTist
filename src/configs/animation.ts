export const ANIMATION_DEFAULT_DURATION = 1000
export const ANIMATION_DEFAULT_TRIGGER = 'click'
export const ANIMATION_CLASS_PREFIX = 'animate__'

export const ENTER_ANIMATIONS = [
  {
    type: 'bounce',
    name: 'bounce',
    children: [
      { name: 'bounceIn', value: 'bounceIn' },
      { name: 'bounceInLeft', value: 'bounceInLeft' },
      { name: 'BounceInRight', value: 'bounceInRight' },
      { name: 'bounceInUp', value: 'bounceInUp' },
      { name: 'BounceInDown', value: 'bounceInDown' },
    ],
  },
  {
    type: 'fade',
    name: 'emerge',
    children: [
      { name: 'float', value: 'fadeIn' },
      { name: 'FadeInDown', value: 'fadeInDown' },
      { name: 'FadeInDownBig', value: 'fadeInDownBig' },
      { name: 'Float right', value: 'fadeInLeft' },
      { name: 'FadeInLeftBig', value: 'fadeInLeftBig' },
      { name: 'FadeInRight', value: 'fadeInRight' },
      { name: 'FadeInRightBig', value: 'fadeInRightBig' },
      { name: 'FadeInUp', value: 'fadeInUp' },
      { name: 'FadeInUpBig', value: 'fadeInUpBig' },
      { name: 'Float from top left', value: 'fadeInTopLeft' },
      { name: 'FadeInTopRight', value: 'fadeInTopRight' },
      { name: 'FadeInBottomLeft', value: 'fadeInBottomLeft' },
      { name: 'FadeInBottomRight', value: 'fadeInBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: 'Rotation',
    children: [
      { name: 'RotateIn', value: 'rotateIn' },
      { name: 'Enter around the bottom left', value: 'rotateInDownLeft' },
      { name: 'rotateInDownRight', value: 'rotateInDownRight' },
      { name: 'RotateInUpLeft', value: 'rotateInUpLeft' },
      { name: 'rotateInUpRight', value: 'rotateInUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: 'Zoom',
    children: [
      { name: 'zoom in', value: 'zoomIn' },
      { name: 'zoom down and enter', value: 'zoomInDown' },
      { name: 'zoom in from the left', value: 'zoomInLeft' },
      { name: 'zoom in from right', value: 'zoomInRight' },
      { name: 'zoom up and enter', value: 'zoomInUp' },
    ],
  },
  {
    type: 'slide',
    name: 'Slide in',
    children: [
      { name: 'slideInDown', value: 'slideInDown' },
      { name: 'slide in from right', value: 'slideInLeft' },
      { name: 'slide in from the left', value: 'slideInRight' },
      { name: 'slideInUp', value: 'slideInUp' },
    ],
  },
  {
    type: 'flip',
    name: 'Flip',
    children: [
      { name: 'X-axis flip into', value: 'flipInX' },
      { name: 'Y axis flip into', value: 'flipInY' },
    ],
  },
  {
    type: 'back',
    name: 'Zoom in and slide in',
    children: [
      { name: 'zoom down and slide in', value: 'backInDown' },
      { name: 'Zoom in from the left', value: 'backInLeft' },
      { name: 'Enlarge and slide in from the right', value: 'backInRight' },
      { name: 'Slide up to zoom in', value: 'backInUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: 'fly in',
    children: [
      { name: 'fly in from the right', value: 'lightSpeedInRight' },
      { name: 'fly in from the left', value: 'lightSpeedInLeft' },
    ],
  },
]

export const EXIT_ANIMATIONS = [
  {
    type: 'bounce',
    name: 'bounce',
    children: [
      { name: 'bounce', value: 'bounceOut' },
      { name: 'Bounce to the left', value: 'bounceOutLeft' },
      { name: 'Bounce Right', value: 'bounceOutRight' },
      { name: 'Bounce Up', value: 'bounceOutUp' },
      { name: 'Bounce Down', value: 'bounceOutDown' },
    ],
  },
  {
    type: 'fade',
    name: 'emerge',
    children: [
      { name: 'FadeOut', value: 'fadeOut' },
      { name: 'FadeOutDown', value: 'fadeOutDown' },
      { name: 'FadeOut long distance down', value: 'fadeOutDownBig' },
      { name: 'FadeOutLeft', value: 'fadeOutLeft' },
      { name: 'FadeOutLeftBig', value: 'fadeOutLeftBig' },
      { name: 'Fade to the right', value: 'fadeOutRight' },
      { name: 'Long Fade to the Right', value: 'fadeOutRightBig' },
      { name: 'FadeOutUp', value: 'fadeOutUp' },
      { name: 'FadeOutUpBig', value: 'fadeOutUpBig' },
      { name: 'FadeOut from the top left', value: 'fadeOutTopLeft' },
      { name: 'FadeOutTopRight', value: 'fadeOutTopRight' },
      { name: 'FadeOutBottomLeft', value: 'fadeOutBottomLeft' },
      { name: 'FadeOutBottomRight', value: 'fadeOutBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: 'Rotation',
    children: [
      { name: 'RotateOut', value: 'rotateOut' },
      { name: 'rotateOutDownLeft', value: 'rotateOutDownLeft' },
      { name: 'rotateOutDownRight', value: 'rotateOutDownRight' },
      { name: 'Exit around the upper left', value: 'rotateOutUpLeft' },
      { name: 'Exit around the upper right', value: 'rotateOutUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: 'Zoom',
    children: [
      { name: 'zoom out', value: 'zoomOut' },
      { name: 'Zoom Down and Exit', value: 'zoomOutDown' },
      { name: 'Zoom out from the left', value: 'zoomOutLeft' },
      { name: 'Zoom out from the right', value: 'zoomOutRight' },
      { name: 'zoom out up', value: 'zoomOutUp' },
    ],
  },
  {
    type: 'slide',
    name: 'Slide out',
    children: [
      { name: 'slideOutDown', value: 'slideOutDown' },
      { name: 'slide out from the left', value: 'slideOutLeft' },
      { name: 'slide out from right', value: 'slideOutRight' },
      { name: 'slide up', value: 'slideOutUp' },
    ],
  },
  {
    type: 'flip',
    name: 'Flip',
    children: [
      { name: 'X-axis flip exit', value: 'flipOutX' },
      { name: 'Y-axis flip exit', value: 'flipOutY' },
    ],
  },
  {
    type: 'back',
    name: 'Zoom out and slide out',
    children: [
      { name: 'Slide down to zoom out', value: 'backOutDown' },
      { name: 'Zoom out from left', value: 'backOutLeft' },
      { name: 'Zoom out from the right', value: 'backOutRight' },
      { name: 'Slide up to zoom out', value: 'backOutUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: 'fly out',
    children: [
      { name: 'Fly out from the right', value: 'lightSpeedOutRight' },
      { name: 'Fly out from the left', value: 'lightSpeedOutLeft' },
    ],
  },
]

export const ATTENTION_ANIMATIONS = [
  {
    type: 'shake',
    name: 'Shaking',
    children: [
      { name: 'Shake left and right', value: 'shakeX' },
      { name: 'Shake up and down', value: 'shakeY' },
      { name: 'Shaking head', value: 'headShake' },
      { name: 'swing', value: 'swing' },
      { name: 'wobble', value: 'wobble' },
      { name: 'panic', value: 'tada' },
      { name: 'jelly', value: 'jello' },
    ],
  },
  {
    type: 'other',
    name: 'other',
    children: [
      { name: 'bounce', value: 'bounce' },
      { name: 'flash', value: 'flash' },
      { name: 'pulse', value: 'pulse' },
      { name: 'RubberBand', value: 'rubberBand' },
      { name: 'heartbeat (fast)', value: 'heartBeat' },
    ],
  },
]