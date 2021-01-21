import mitt, { Emitter } from 'mitt'

export enum EmitterEvents {
  UPDATE_TEXT_STATE = 'UPDATE_TEXT_STATE',
  EXEC_TEXT_COMMAND = 'EXEC_TEXT_COMMAND',
  SCALE_ELEMENT_STATE = 'SCALE_ELEMENT_STATE',
}

const emitter: Emitter = mitt()

export default emitter