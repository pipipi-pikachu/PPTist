import mitt, { Emitter } from 'mitt'

export const enum EmitterEvents {
  UPDATE_TEXT_STATE = 'UPDATE_TEXT_STATE',
  EXEC_TEXT_COMMAND = 'EXEC_TEXT_COMMAND',
  UPDATE_TABLE_SELECTED_CELL = 'UPDATE_TABLE_SELECTED_CELL',
  SCALE_ELEMENT_STATE = 'SCALE_ELEMENT_STATE',
}

const emitter: Emitter = mitt()

export default emitter