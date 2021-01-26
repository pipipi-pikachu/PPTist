import mitt, { Emitter } from 'mitt'

export enum EmitterEvents {
  UPDATE_TEXT_STATE = 'UPDATE_TEXT_STATE',
  EXEC_TEXT_COMMAND = 'EXEC_TEXT_COMMAND',
  UPDATE_TABLE_SELECTED_CELL = 'UPDATE_TABLE_SELECTED_CELL',
  EXEC_TABLE_COMMAND = 'EXEC_TABLE_COMMAND',
  SCALE_ELEMENT_STATE = 'SCALE_ELEMENT_STATE',
}

const emitter: Emitter = mitt()

export default emitter