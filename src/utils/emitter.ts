import mitt, { Emitter } from 'mitt'

export const enum EmitterEvents {
  RICH_TEXT_COMMAND = 'RICH_TEXT_COMMAND',
  OPEN_CHART_DATA_EDITOR = 'OPEN_CHART_DATA_EDITOR',
  OPEN_LATEX_EDITOR = 'OPEN_LATEX_EDITOR',
}

export interface RichTextAction {
  command: string
  value?: string
}

export interface RichTextCommand {
  target?: string
  action: RichTextAction | RichTextAction[]
}

type Events = {
  [EmitterEvents.RICH_TEXT_COMMAND]: RichTextCommand
  [EmitterEvents.OPEN_CHART_DATA_EDITOR]: void
  [EmitterEvents.OPEN_LATEX_EDITOR]: void
} 

const emitter: Emitter<Events> = mitt<Events>()

export default emitter