import { t } from '@/i18n';

import type { TurningMode } from '@/types/slides'

export const ANIMATION_DEFAULT_DURATION = 1000
export const ANIMATION_DEFAULT_TRIGGER = 'click'
export const ANIMATION_CLASS_PREFIX = 'animate__'

export const ENTER_ANIMATIONS = [
  {
    type: 'bounce',
    name: t('Commons.text.text_gz4q'),
    children: [
      { name: t('Commons.text.text_gn64'), value: 'bounceIn' },
      { name: t('Commons.text.text_aygzpq'), value: 'bounceInLeft' },
      { name: t('Commons.text.text_azxgch'), value: 'bounceInRight' },
      { name: t('Commons.text.text_axltt1'), value: 'bounceInUp' },
      { name: t('Commons.text.text_axlujq'), value: 'bounceInDown' },
    ],
  },
  {
    type: 'fade',
    name: t('Commons.text.text_j8xu'),
    children: [
      { name: t('Commons.text.text_j25z'), value: 'fadeIn' },
      { name: t('Commons.text.text_axo9jl'), value: 'fadeInDown' },
      { name: t('Commons.text.text_1ndwnj'), value: 'fadeInDownBig' },
      { name: t('Commons.text.text_ayjepl'), value: 'fadeInLeft' },
      { name: t('Commons.text.text_oqqttj'), value: 'fadeInLeftBig' },
      { name: t('Commons.text.text_azzvcc'), value: 'fadeInRight' },
      { name: t('Commons.text.text_7dx8uu'), value: 'fadeInRightBig' },
      { name: t('Commons.text.text_axo8sw'), value: 'fadeInUp' },
      { name: t('Commons.text.text_1mu426'), value: 'fadeInUpBig' },
      { name: t('Commons.text.text_yurgk7'), value: 'fadeInTopLeft' },
      { name: t('Commons.text.text_yx69to'), value: 'fadeInTopRight' },
      { name: t('Commons.text.text_yurfti'), value: 'fadeInBottomLeft' },
      { name: t('Commons.text.text_yx6akd'), value: 'fadeInBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: t('Commons.label.text_i3nl'),
    children: [
      { name: t('Commons.text.text_dfwhij'), value: 'rotateIn' },
      { name: t('Commons.text.text_avgqg4'), value: 'rotateInDownLeft' },
      { name: t('Commons.text.text_9maeuv'), value: 'rotateInDownRight' },
      { name: t('Commons.text.text_avgppf'), value: 'rotateInUpLeft' },
      { name: t('Commons.text.text_9mae46'), value: 'rotateInUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: t('Commons.text.text_m6np'),
    children: [
      { name: t('Commons.text.text_d5gaj7'), value: 'zoomIn' },
      { name: t('Commons.text.text_4n9vgz'), value: 'zoomInDown' },
      { name: t('Commons.text.text_c69gb9'), value: 'zoomInLeft' },
      { name: t('Commons.text.text_jyemd4'), value: 'zoomInRight' },
      { name: t('Commons.text.text_4nto2c'), value: 'zoomInUp' },
    ],
  },
  {
    type: 'slide',
    name: t('Commons.text.text_jano'),
    children: [
      { name: t('Commons.text.text_axoi1a'), value: 'slideInDown' },
      { name: t('Commons.text.text_aanjvd'), value: 'slideInLeft' },
      { name: t('Commons.text.text_ac40i4'), value: 'slideInRight' },
      { name: t('Commons.text.text_axohal'), value: 'slideInUp' },
    ],
  },
  {
    type: 'flip',
    name: t('Commons.text.text_mk0h'),
    children: [
      { name: t('Commons.text.x'), value: 'flipInX' },
      { name: t('Commons.text.y'), value: 'flipInY' },
    ],
  },
  {
    type: 'back',
    name: t('Commons.text.text_d5ao7x'),
    children: [
      { name: t('Commons.text.text_4nfhs9'), value: 'backInDown' },
      { name: t('Commons.text.text_c6f2mj'), value: 'backInLeft' },
      { name: t('Commons.text.text_jy901u'), value: 'backInRight' },
      { name: t('Commons.text.text_4nzadm'), value: 'backInUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: t('Commons.text.text_qg5j'),
    children: [
      { name: t('Commons.text.text_aaupd8'), value: 'lightSpeedInRight' },
      { name: t('Commons.text.text_acb5zz'), value: 'lightSpeedInLeft' },
    ],
  },
]

export const EXIT_ANIMATIONS = [
  {
    type: 'bounce',
    name: t('Commons.text.text_gz4q'),
    children: [
      { name: t('Commons.text.text_gna9'), value: 'bounceOut' },
      { name: t('Commons.text.text_azxggm'), value: 'bounceOutLeft' },
      { name: t('Commons.text.text_aygztv'), value: 'bounceOutRight' },
      { name: t('Commons.text.text_axltx6'), value: 'bounceOutUp' },
      { name: t('Commons.text.text_axlunv'), value: 'bounceOutDown' },
    ],
  },
  {
    type: 'fade',
    name: t('Commons.text.text_j8xu'),
    children: [
      { name: t('Commons.text.text_j2a4'), value: 'fadeOut' },
      { name: t('Commons.text.text_axo9nq'), value: 'fadeOutDown' },
      { name: t('Commons.text.text_1ndwro'), value: 'fadeOutDownBig' },
      { name: t('Commons.text.text_azzvgh'), value: 'fadeOutLeft' },
      { name: t('Commons.text.text_7dx8qp'), value: 'fadeOutLeftBig' },
      { name: t('Commons.text.text_ayjetq'), value: 'fadeOutRight' },
      { name: t('Commons.text.text_oqqtxo'), value: 'fadeOutRightBig' },
      { name: t('Commons.text.text_axo8x1'), value: 'fadeOutUp' },
      { name: t('Commons.text.text_1mu46b'), value: 'fadeOutUpBig' },
      { name: t('Commons.text.text_yurgg2'), value: 'fadeOutTopLeft' },
      { name: t('Commons.text.text_yx69xt'), value: 'fadeOutTopRight' },
      { name: t('Commons.text.text_yurfpd'), value: 'fadeOutBottomLeft' },
      { name: t('Commons.text.text_yx6aoi'), value: 'fadeOutBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: t('Commons.label.text_i3nl'),
    children: [
      { name: t('Commons.text.text_dfwiij'), value: 'rotateOut' },
      { name: t('Commons.text.text_avgrg4'), value: 'rotateOutDownLeft' },
      { name: t('Commons.text.text_9mafuv'), value: 'rotateOutDownRight' },
      { name: t('Commons.text.text_avgqpf'), value: 'rotateOutUpLeft' },
      { name: t('Commons.text.text_9maf46'), value: 'rotateOutUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: t('Commons.text.text_m6np'),
    children: [
      { name: t('Commons.text.text_gfk96o'), value: 'zoomOut' },
      { name: t('Commons.text.text_1d5wti'), value: 'zoomOutDown' },
      { name: t('Commons.text.text_8w5hns'), value: 'zoomOutLeft' },
      { name: t('Commons.text.text_n8il0l'), value: 'zoomOutRight' },
      { name: t('Commons.text.text_1dppev'), value: 'zoomOutUp' },
    ],
  },
  {
    type: 'slide',
    name: t('Commons.text.text_jart'),
    children: [
      { name: t('Commons.text.text_axoi5f'), value: 'slideOutDown' },
      { name: t('Commons.text.text_ac40m9'), value: 'slideOutLeft' },
      { name: t('Commons.text.text_aanjzi'), value: 'slideOutRight' },
      { name: t('Commons.text.text_axoheq'), value: 'slideOutUp' },
    ],
  },
  {
    type: 'flip',
    name: t('Commons.text.text_mk0h'),
    children: [
      { name: t('Commons.text.x_2'), value: 'flipOutX' },
      { name: t('Commons.text.y_2'), value: 'flipOutY' },
    ],
  },
  {
    type: 'back',
    name: t('Commons.text.text_gfelzj'),
    children: [
      { name: t('Commons.text.text_1dbk0n'), value: 'backOutDown' },
      { name: t('Commons.text.text_8wb4ux'), value: 'backOutLeft' },
      { name: t('Commons.text.text_n8cxtg'), value: 'backOutRight' },
      { name: t('Commons.text.text_1dvcm0'), value: 'backOutUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: t('Commons.text.text_qg9o'),
    children: [
      { name: t('Commons.text.text_aauphd'), value: 'lightSpeedOutRight' },
      { name: t('Commons.text.text_acb644'), value: 'lightSpeedOutLeft' },
    ],
  },
]

export const ATTENTION_ANIMATIONS = [
  {
    type: 'shake',
    name: t('Commons.text.text_huit'),
    children: [
      { name: t('Commons.text.text_c754rt'), value: 'shakeX' },
      { name: t('Commons.text.text_a69kv1'), value: 'shakeY' },
      { name: t('Commons.text.text_hjnx'), value: 'headShake' },
      { name: t('Commons.text.text_hici'), value: 'swing' },
      { name: t('Commons.text.text_huit'), value: 'wobble' },
      { name: t('Commons.text.text_gzpi'), value: 'tada' },
      { name: t('Commons.text.text_i2lb'), value: 'jello' },
    ],
  },
  {
    type: 'other',
    name: t('Commons.text.text_eae8'),
    children: [
      { name: t('Commons.text.text_gz4q'), value: 'bounce' },
      { name: t('Commons.text.text_q49j'), value: 'flash' },
      { name: t('Commons.text.text_mhwm'), value: 'pulse' },
      { name: t('Commons.text.text_g5sou'), value: 'rubberBand' },
      { name: t('Commons.text.text_wsy7m2'), value: 'heartBeat' },
    ],
  },
]

interface SlideAnimation {
  label: string
  value: TurningMode
}

export const SLIDE_ANIMATIONS: SlideAnimation[] = [
  { label: t('Commons.label.text_k4g'), value: 'no' },
  { label: t('Commons.label.text_q6bv'), value: 'random' },
  { label: t('Commons.label.text_c754v4'), value: 'slideX' },
  { label: t('Commons.label.text_a69kyc'), value: 'slideY' },
  { label: t('Commons.label.3d'), value: 'slideX3D' },
  { label: t('Commons.label.3d_2'), value: 'slideY3D' },
  { label: t('Commons.label.text_e7ddy5'), value: 'fade' },
  { label: t('Commons.label.text_i3nl'), value: 'rotate' },
  { label: t('Commons.label.text_a686rw'), value: 'scaleY' },
  { label: t('Commons.label.text_c73qoo'), value: 'scaleX' },
  { label: t('Commons.label.text_hpk9'), value: 'scale' },
  { label: t('Commons.label.text_m4ue'), value: 'scaleReverse' },
]