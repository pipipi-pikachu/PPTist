import { MarkType } from 'prosemirror-model'
import { SelectionRange, Transaction, TextSelection } from 'prosemirror-state'

const markApplies = (tr: Transaction, ranges: SelectionRange[], type: MarkType) => {
  for (let i = 0; i < ranges.length; i++) {
    let {$from, $to} = ranges[i]
    let can = $from.depth == 0 ? tr.doc.type.allowsMarkType(type) : false
    tr.doc.nodesBetween($from.pos, $to.pos, node => {
      if (can) return false
      can = node.inlineContent && node.type.allowsMarkType(type)
    })
    if (can) return true
  }
  return false
}

export const applyMark = (tr: Transaction, markType: MarkType, attrs: { [key: string]: string; } | undefined) => {
  if(!tr.selection || !tr.doc || !markType) return tr
  
  const empty = tr.selection.empty
  const ranges = tr.selection.ranges
  const $cursor = (tr.selection as TextSelection).$cursor

  if(empty && !$cursor || !markApplies(tr, ranges, markType)) return tr

  if($cursor) {
    tr = tr.removeStoredMark(markType)
    return attrs ? tr.addStoredMark(markType.create(attrs)) : tr
  }

  let has = false
  for(let i = 0; !has && i < ranges.length; i++) {
    const { $from, $to } = ranges[i]
    has = tr.doc.rangeHasMark($from.pos, $to.pos, markType)
  }
  for(let j = 0; j < ranges.length; j++) {
    const { $from, $to } = ranges[j]
    if(has) tr = tr.removeMark($from.pos, $to.pos, markType)
    if(attrs) tr = tr.addMark($from.pos, $to.pos, markType.create(attrs))
  }

  return tr
}