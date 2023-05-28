export const ANIMATION_DEFAULT_DURATION = 1000
export const ANIMATION_DEFAULT_TRIGGER = 'click'
export const ANIMATION_CLASS_PREFIX = 'animate__'

export const ENTER_ANIMATIONS = [
  {
    type: 'bounce',
    name: 'animations.bounce',
    children: [
      {name: 'animations.bounceIn', value: 'bounceIn'},
      {name: 'animations.bounceInLeft', value: 'bounceInLeft'},
      {name: 'animations.bounceInRight', value: 'bounceInRight'},
      {name: 'animations.bounceInUp', value: 'bounceInUp'},
      {name: 'animations.bounceInDown', value: 'bounceInDown'}
    ]
  },
  {
    type: 'fade',
    name: 'animations.fade',
    children: [
      {name: 'animations.fadeIn', value: 'fadeIn'},
      {name: 'animations.fadeInDown', value: 'fadeInDown'},
      {name: 'animations.fadeInDownBig', value: 'fadeInDownBig'},
      {name: 'animations.fadeInLeft', value: 'fadeInLeft'},
      {name: 'animations.fadeInLeftBig', value: 'fadeInLeftBig'},
      {name: 'animations.fadeInRight', value: 'fadeInRight'},
      {name: 'animations.fadeInRightBig', value: 'fadeInRightBig'},
      {name: 'animations.fadeInUp', value: 'fadeInUp'},
      {name: 'animations.fadeInUpBig', value: 'fadeInUpBig'},
      {name: 'animations.fadeInTopLeft', value: 'fadeInTopLeft'},
      {name: 'animations.fadeInTopRight', value: 'fadeInTopRight'},
      {name: 'animations.fadeInBottomLeft', value: 'fadeInBottomLeft'},
      {name: 'animations.fadeInBottomRight', value: 'fadeInBottomRight'}
    ]
  },
  {
    type: 'rotate',
    name: 'animations.rotate',
    children: [
      {name: 'animations.rotateIn', value: 'rotateIn'},
      {name: 'animations.rotateInDownLeft', value: 'rotateInDownLeft'},
      {name: 'animations.rotateInDownRight', value: 'rotateInDownRight'},
      {name: 'animations.rotateInUpLeft', value: 'rotateInUpLeft'},
      {name: 'animations.rotateInUpRight', value: 'rotateInUpRight'}
    ]
  },
  {
    type: 'zoom',
    name: 'animations.zoom',
    children: [
      {name: 'animations.zoomIn', value: 'zoomIn'},
      {name: 'animations.zoomInDown', value: 'zoomInDown'},
      {name: 'animations.zoomInLeft', value: 'zoomInLeft'},
      {name: 'animations.zoomInRight', value: 'zoomInRight'},
      {name: 'animations.zoomInUp', value: 'zoomInUp'}
    ]
  },
  {
    type: 'slide',
    name: 'animations.slide',
    children: [
      {name: 'animations.slideInDown', value: 'slideInDown'},
      {name: 'animations.slideInLeft', value: 'slideInLeft'},
      {name: 'animations.slideInRight', value: 'slideInRight'},
      {name: 'animations.slideInUp', value: 'slideInUp'}
    ]
  },
  {
    type: 'flip',
    name: 'animations.flip',
    children: [
      {name: 'animations.flipInX', value: 'flipInX'},
      {name: 'animations.flipInY', value: 'flipInY'}
    ]
  },
  {
    type: 'back',
    name: 'animations.back',
    children: [
      {name: 'animations.backInDown', value: 'backInDown'},
      {name: 'animations.backInLeft', value: 'backInLeft'},
      {name: 'animations.backInRight', value: 'backInRight'},
      {name: 'animations.backInUp', value: 'backInUp'}
    ]
  },
  {
    type: 'lightSpeed',
    name: 'animations.lightSpeed',
    children: [
      {name: 'animations.lightSpeedInRight', value: 'lightSpeedInRight'},
      {name: 'animations.lightSpeedInLeft', value: 'lightSpeedInLeft'}
    ]
  }
]

export const EXIT_ANIMATIONS = [
  {
    type: 'bounce',
    name: 'animations.bounce',
    children: [
      {name: 'animations.bounceOut', value: 'bounceOut'},
      {name: 'animations.bounceOutLeft', value: 'bounceOutLeft'},
      {name: 'animations.bounceOutRight', value: 'bounceOutRight'},
      {name: 'animations.bounceOutUp', value: 'bounceOutUp'},
      {name: 'animations.bounceOutDown', value: 'bounceOutDown'},
    ],
  },
  {
    type: 'fade',
    name: 'animations.fade',
    children: [
      {name: 'animations.fadeOut', value: 'fadeOut'},
      {name: 'animations.fadeOutDown', value: 'fadeOutDown'},
      {name: 'animations.fadeOutDownBig', value: 'fadeOutDownBig'},
      {name: 'animations.fadeOutLeft', value: 'fadeOutLeft'},
      {name: 'animations.fadeOutLeftBig', value: 'fadeOutLeftBig'},
      {name: 'animations.fadeOutRight', value: 'fadeOutRight'},
      {name: 'animations.fadeOutRightBig', value: 'fadeOutRightBig'},
      {name: 'animations.fadeOutUp', value: 'fadeOutUp'},
      {name: 'animations.fadeOutUpBig', value: 'fadeOutUpBig'},
      {name: 'animations.fadeOutTopLeft', value: 'fadeOutTopLeft'},
      {name: 'animations.fadeOutTopRight', value: 'fadeOutTopRight'},
      {name: 'animations.fadeOutBottomLeft', value: 'fadeOutBottomLeft'},
      {name: 'animations.fadeOutBottomRight', value: 'fadeOutBottomRight'},
    ],
  },
  {
    type: 'rotate',
    name: 'animations.rotate',
    children: [
      {name: 'animations.rotateOut', value: 'rotateOut'},
      {name: 'animations.rotateOutDownLeft', value: 'rotateOutDownLeft'},
      {name: 'animations.rotateOutDownRight', value: 'rotateOutDownRight'},
      {name: 'animations.rotateOutUpLeft', value: 'rotateOutUpLeft'},
      {name: 'animations.rotateOutUpRight', value: 'rotateOutUpRight'},
    ],
  },
  {
    type: 'zoom',
    name: 'animations.zoom',
    children: [
      {name: 'animations.zoomOut', value: 'zoomOut'},
      {name: 'animations.zoomOutDown', value: 'zoomOutDown'},
      {name: 'animations.zoomOutLeft', value: 'zoomOutLeft'},
      {name: 'animations.zoomOutRight', value: 'zoomOutRight'},
      {name: 'animations.zoomOutUp', value: 'zoomOutUp'},
    ],
  },
  {
    type: 'slide',
    name: 'animations.slide',
    children: [
      {name: 'animations.slideOutDown', value: 'slideOutDown'},
      {name: 'animations.slideOutLeft', value: 'slideOutLeft'},
      {name: 'animations.slideOutRight', value: 'slideOutRight'},
      {name: 'animations.slideOutUp', value: 'slideOutUp'},
    ],
  },
  {
    type: 'flip',
    name: 'animations.flip',
    children: [
      {name: 'animations.flipOutX', value: 'flipOutX'},
      {name: 'animations.flipOutY', value: 'flipOutY'},
    ],
  },
  {
    type: 'back',
    name: 'animations.back',
    children: [
      {name: 'animations.backOutDown', value: 'backOutDown'},
      {name: 'animations.backOutLeft', value: 'backOutLeft'},
      {name: 'animations.backOutRight', value: 'backOutRight'},
      {name: 'animations.backOutUp', value: 'backOutUp'},
    ],
  },
  {
    type: 'lightSpeed',
    name: 'animations.lightSpeed',
    children: [
      {name: 'animations.lightSpeedOutRight', value: 'lightSpeedOutRight'},
      {name: 'animations.lightSpeedOutLeft', value: 'lightSpeedOutLeft'},
    ],
  },
]

export const ATTENTION_ANIMATIONS = [
  {
    type: 'shake',
    name: 'animations.shake',
    children: [
      {name: 'animations.shakeX', value: 'shakeX'},
      {name: 'animations.shakeY', value: 'shakeY'},
      {name: 'animations.headShake', value: 'headShake'},
      {name: 'animations.swing', value: 'swing'},
      {name: 'animations.wobble', value: 'wobble'},
      {name: 'animations.tada', value: 'tada'},
      {name: 'animations.jello', value: 'jello'},
    ],
  },
  {
    type: 'other',
    name: 'animations.other',
    children: [
      {name: 'animations.bounce', value: 'bounce'},
      {name: 'animations.flash', value: 'flash'},
      {name: 'animations.pulse', value: 'pulse'},
      {name: 'animations.rubberBand', value: 'rubberBand'},
      {name: 'animations.heartBeat', value: 'heartBeat'},
    ],
  },
]
