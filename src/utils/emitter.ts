import mitt, { Emitter } from 'mitt'

export enum EMITTER_EVENTS {
  
}

const emitter: Emitter = mitt()

export default emitter