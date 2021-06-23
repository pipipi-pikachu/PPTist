import mitt, { Handler, Emitter } from 'mitt'

export const enum EmitterEvents {
  EXEC_TEXT_COMMAND = 'EXEC_TEXT_COMMAND',
}

const emitter: Emitter = mitt()

export type EmitterHandler = Handler

export default emitter