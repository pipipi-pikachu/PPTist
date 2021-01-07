import mitt, { Emitter } from 'mitt'

export enum EmitterEvents {
  UPDATE_TEXT_STATE = 'UPDATE_TEXT_STATE',
  EXEC_TEXT_COMMAND = 'EXEC_TEXT_COMMAND',
}

const emitter: Emitter = mitt()

export default emitter