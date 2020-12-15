export type ElementOrderCommand = 'up' | 'down' | 'top' | 'bottom'

export enum ElementOrderCommands {
  UP = 'up',
  DOWN = 'down',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export type ElementAlignCommand = 'top'| 'bottom' | 'left' | 'right' | 'vertical' | 'horizontal'

export enum ElementAlignCommands {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export type ElementScaleHandler = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type ElementLockCommand = 'lock' | 'unlock'

export enum ElementLockCommands {
  LOCK = 'lock',
  UNLOCK = 'unlock',
}