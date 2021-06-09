import mitt, { Handler, Emitter } from 'mitt'

export const enum EmitterEvents {
  EXEC_TEXT_COMMAND = 'EXEC_TEXT_COMMAND',
  SCALE_ELEMENT_STATE = 'SCALE_ELEMENT_STATE',
}

const emitter: Emitter = mitt()

export type EmitterHandler = Handler

export default emitter