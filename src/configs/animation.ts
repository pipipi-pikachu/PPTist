import type { TurningMode } from "@/types/slides";

export const ANIMATION_DEFAULT_DURATION = 1000;
export const ANIMATION_DEFAULT_TRIGGER = "click";
export const ANIMATION_CLASS_PREFIX = "animate__";

export const ENTER_ANIMATIONS = [
  {
    type: "bounce",
    name: "bounce",
    children: [
      { name: "Bounce", value: "bounceIn" },
      { name: "Bounce in left", value: "bounceInLeft" },
      { name: "Bounce in right", value: "bounceInRight" },
      { name: "Bounce in up", value: "bounceInUp" },
      { name: "Bounce in down", value: "bounceInDown" },
    ],
  },
  {
    type: "fade",
    name: "Fade",
    children: [
      { name: "Fade in", value: "fadeIn" },
      { name: "Fade in down", value: "fadeInDown" },
      { name: "Fade in down big", value: "fadeInDownBig" },
      { name: "Fade in left", value: "fadeInLeft" },
      { name: "Fade in left big", value: "fadeInLeftBig" },
      { name: "Fade in right", value: "fadeInRight" },
      { name: "Fade in right big", value: "fadeInRightBig" },
      { name: "Fade in up", value: "fadeInUp" },
      { name: "Fade in up big", value: "fadeInUpBig" },
      { name: "Fade in top left", value: "fadeInTopLeft" },
      { name: "Fade in top right", value: "fadeInTopRight" },
      { name: "Fade in bottom left", value: "fadeInBottomLeft" },
      { name: "Fade in bottom right", value: "fadeInBottomRight" },
    ],
  },
  {
    type: "rotate",
    name: "Rotate",
    children: [
      { name: "Rotate in", value: "rotateIn" },
      { name: "Rotate in down left", value: "rotateInDownLeft" },
      { name: "Rotate in down right", value: "rotateInDownRight" },
      { name: "Rotat in up left", value: "rotateInUpLeft" },
      { name: "Rotate in up right", value: "rotateInUpRight" },
    ],
  },
  {
    type: "zoom",
    name: "Zoom",
    children: [
      { name: "Zoom in", value: "zoomIn" },
      { name: "Zoom in down", value: "zoomInDown" },
      { name: "Zoom in left", value: "zoomInLeft" },
      { name: "Zoom in right", value: "zoomInRight" },
      { name: "Zoom in up", value: "zoomInUp" },
    ],
  },
  {
    type: "slide",
    name: "Slide",
    children: [
      { name: "Slide in down", value: "slideInDown" },
      { name: "Slide in left", value: "slideInLeft" },
      { name: "Slide in right", value: "slideInRight" },
      { name: "Slide in up", value: "slideInUp" },
    ],
  },
  {
    type: "flip",
    name: "Flip",
    children: [
      { name: "Flip in x", value: "flipInX" },
      { name: "Flip in y", value: "flipInY" },
    ],
  },
  {
    type: "back",
    name: "Back",
    children: [
      { name: "Back in down", value: "backInDown" },
      { name: "Back in left", value: "backInLeft" },
      { name: "Back in right", value: "backInRight" },
      { name: "Back in up", value: "backInUp" },
    ],
  },
  {
    type: "lightSpeed",
    name: "Light Speed",
    children: [
      { name: "Light speed in right", value: "lightSpeedInRight" },
      { name: "Light speed in left", value: "lightSpeedInLeft" },
    ],
  },
];

export const EXIT_ANIMATIONS = [
  {
    type: "bounce",
    name: "bounce",
    children: [
      { name: "Bounce out", value: "bounceOut" },
      { name: "Bounce out left", value: "bounceOutLeft" },
      { name: "Bounce out right", value: "bounceOutRight" },
      { name: "Bounce out up", value: "bounceOutUp" },
      { name: "Bounce out down", value: "bounceOutDown" },
    ],
  },
  {
    type: "fade",
    name: "Fade",
    children: [
      { name: "Fade out", value: "fadeOut" },
      { name: "Fade out down", value: "fadeOutDown" },
      { name: "Fade out down big", value: "fadeOutDownBig" },
      { name: "Fade out left ", value: "fadeOutLeft" },
      { name: "Fade out left big", value: "fadeOutLeftBig" },
      { name: "Fade out right", value: "fadeOutRight" },
      { name: "Fade out right big", value: "fadeOutRightBig" },
      { name: "Fade out up", value: "fadeOutUp" },
      { name: "Fade out up big", value: "fadeOutUpBig" },
      { name: "Fade out top left", value: "fadeOutTopLeft" },
      { name: "Fade out top right", value: "fadeOutTopRight" },
      { name: "Fade out bottom left", value: "fadeOutBottomLeft" },
      { name: "Fade out bottom right", value: "fadeOutBottomRight" },
    ],
  },
  {
    type: "rotate",
    name: "Rotate",
    children: [
      { name: "Rotate out", value: "rotateOut" },
      { name: "Rotate out down left", value: "rotateOutDownLeft" },
      { name: "Rotate out right", value: "rotateOutDownRight" },
      { name: "Rotate out up left", value: "rotateOutUpLeft" },
      { name: "Rotate out up right", value: "rotateOutUpRight" },
    ],
  },
  {
    type: "zoom",
    name: "Zoom",
    children: [
      { name: "Zoom out", value: "zoomOut" },
      { name: "Zoom out down", value: "zoomOutDown" },
      { name: "Zoom out left", value: "zoomOutLeft" },
      { name: "Zoom out right", value: "zoomOutRight" },
      { name: "Zoom out up", value: "zoomOutUp" },
    ],
  },
  {
    type: "slide",
    name: "Slide",
    children: [
      { name: "Slide out down", value: "slideOutDown" },
      { name: "Slide out left", value: "slideOutLeft" },
      { name: "Slide out right", value: "slideOutRight" },
      { name: "Slide out up", value: "slideOutUp" },
    ],
  },
  {
    type: "flip",
    name: "Flip",
    children: [
      { name: "Flip out x", value: "flipOutX" },
      { name: "Flip out y", value: "flipOutY" },
    ],
  },
  {
    type: "back",
    name: "Back",
    children: [
      { name: "Back out down", value: "backOutDown" },
      { name: "Back out left", value: "backOutLeft" },
      { name: "Back out right", value: "backOutRight" },
      { name: "Back out up", value: "backOutUp" },
    ],
  },
  {
    type: "lightSpeed",
    name: "Light Speed",
    children: [
      { name: "Light speed out right", value: "lightSpeedOutRight" },
      { name: "Light speed out left", value: "lightSpeedOutLeft" },
    ],
  },
];

export const ATTENTION_ANIMATIONS = [
  {
    type: "shake",
    name: "Shake",
    children: [
      { name: "Shake x", value: "shakeX" },
      { name: "Shake y", value: "shakeY" },
      { name: "headshake", value: "headShake" },
      { name: "Swing", value: "swing" },
      { name: "Wobble", value: "wobble" },
      { name: "Tada", value: "tada" },
      { name: "Jello", value: "jello" },
    ],
  },
  {
    type: "other",
    name: "Other",
    children: [
      { name: "Bounce", value: "bounce" },
      { name: "Flash", value: "flash" },
      { name: "Pulse", value: "pulse" },
      { name: "Rubber band", value: "rubberBand" },
      { name: "Heart beat", value: "heartBeat" },
    ],
  },
];

interface SlideAnimation {
  label: string;
  value: TurningMode;
}

export const SLIDE_ANIMATIONS: SlideAnimation[] = [
  { label: "No", value: "no" },
  { label: "Random", value: "random" },
  { label: "Slide x", value: "slideX" },
  { label: "Slide y", value: "slideY" },
  { label: "Slide x 3D", value: "slideX3D" },
  { label: "Slide y 3D", value: "slideY3D" },
  { label: "Fade", value: "fade" },
  { label: "Rotate", value: "rotate" },
  { label: "Scale y", value: "scaleY" },
  { label: "Scale x", value: "scaleX" },
  { label: "Scale", value: "scale" },
  { label: "Scale reverse", value: "scaleReverse" },
];
