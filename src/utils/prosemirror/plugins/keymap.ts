import { splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list'
import { Schema } from 'prosemirror-model'
import { undo, redo } from 'prosemirror-history'
import { undoInputRule } from 'prosemirror-inputrules'
import { Command } from 'prosemirror-state'
import {
  toggleMark,
  selectParentNode,
  joinUp,
  joinDown,
  chainCommands,
  newlineInCode,
  createParagraphNear,
  liftEmptyBlock,
  splitBlockKeepMarks,
} from 'prosemirror-commands'

export const buildKeymap = (schema: Schema) => {
  const keys = {}
  const bind = (key: string, cmd: Command) => keys[key] = cmd

  bind('Alt-ArrowUp', joinUp)
  bind('Alt-ArrowDown', joinDown)
  bind('Ctrl-z', undo)
  bind('Ctrl-y', redo)
  bind('Backspace', undoInputRule)
  bind('Escape', selectParentNode)
  bind('Ctrl-b', toggleMark(schema.marks.strong))
  bind('Ctrl-i', toggleMark(schema.marks.em))
  bind('Ctrl-u', toggleMark(schema.marks.underline))
  bind('Ctrl-d', toggleMark(schema.marks.strikethrough))
  bind('Enter', chainCommands(
    splitListItem(schema.nodes.list_item),
    newlineInCode,
    createParagraphNear,
    liftEmptyBlock,
    splitBlockKeepMarks,
  ))
  bind('Mod-[', liftListItem(schema.nodes.list_item))
  bind('Mod-]', sinkListItem(schema.nodes.list_item))

  return keys
}