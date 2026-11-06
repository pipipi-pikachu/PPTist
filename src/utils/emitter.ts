import mitt, { type Emitter } from 'mitt'
import type { TableTextAttrs } from './prosemirror/table'

export const enum EmitterEvents {
  RICH_TEXT_COMMAND = 'RICH_TEXT_COMMAND',
  TABLE_COMMAND = 'TABLE_COMMAND',
  TABLE_TEXT_COMMAND = 'TABLE_TEXT_COMMAND',
  SYNC_RICH_TEXT_ATTRS_TO_STORE = 'SYNC_RICH_TEXT_ATTRS_TO_STORE',
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

export interface TableCommand {
  targetId: string
  command: 'insert-row' | 'insert-col' | 'delete-row' | 'delete-col'
  position?: 'before' | 'after'
}

export interface TableTextCommand {
  targetId: string
  attrs: Partial<TableTextAttrs>
}

type Events = {
  [EmitterEvents.RICH_TEXT_COMMAND]: RichTextCommand
  [EmitterEvents.TABLE_COMMAND]: TableCommand
  [EmitterEvents.TABLE_TEXT_COMMAND]: TableTextCommand
  [EmitterEvents.SYNC_RICH_TEXT_ATTRS_TO_STORE]: void
  [EmitterEvents.OPEN_CHART_DATA_EDITOR]: void
  [EmitterEvents.OPEN_LATEX_EDITOR]: void
} 

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
