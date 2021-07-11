import mitt, { Emitter } from 'mitt'

export const enum EmitterEvents {
  RICH_TEXT_COMMAND = 'RICH_TEXT_COMMAND',
}

export interface RichTextCommand {
  command: string;
  value?: string;
}

type Events = {
  [EmitterEvents.RICH_TEXT_COMMAND]: RichTextCommand | RichTextCommand[];
} 

const emitter: Emitter<Events> = mitt<Events>()

export default emitter