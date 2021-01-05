import mitt, { Emitter } from 'mitt'

export enum EmitterEvents {
  UPDATE_TEXT_STATE = 'UPDATE_TEXT_STATE',
}

const emitter: Emitter = mitt()

export default emitter