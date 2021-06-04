import { keymap } from 'prosemirror-keymap'
import { Schema } from 'prosemirror-model'
import { history } from 'prosemirror-history'
import { baseKeymap } from 'prosemirror-commands'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'

import { buildKeymap } from './keymap'
import { buildInputRules } from './inputrules'

export const buildPlugins = (schema: Schema) => {
  return [
    buildInputRules(schema),
    keymap(buildKeymap(schema)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    history(),
  ]
}