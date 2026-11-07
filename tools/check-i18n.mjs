import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import { parse } from 'vue/compiler-sfc'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = file => JSON.parse(readFileSync(path.join(root, file), 'utf8'))
const locales = read('src/locales.json')
const english = read('src/locales/en.json')
const parameters = text => [...text.matchAll(/\{p\d+\}/g)].map(m => m[0]).sort().join(',')
const errors = []
for (const locale of locales) {
  let messages
  try {
    messages = read(`src/locales/${locale}.json`)
  }
  catch {
    errors.push(`${locale}: missing or unreadable catalog`); continue
  }
  for (const [key, source] of Object.entries(english)) {
    const value = messages[key]
    if (typeof value !== 'string' || !value.trim()) errors.push(`${locale}: missing ${key}`)
    else if (parameters(value) !== parameters(source)) errors.push(`${locale}: parameters differ for ${key}`)
  }
  for (const key of Object.keys(messages)) if (!(key in english)) errors.push(`${locale}: extra ${key}`)
}
// Parse Vue expressions as well as scripts so interpolated UI copy cannot bypass the check.
function inspectCode(file, source, template = false) {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
  const visit = node => {
    if (ts.isCallExpression(node) && node.expression.getText(ast) === 't') {
      const key = node.arguments[0]
      if (key && ts.isStringLiteral(key) && !(key.text in english)) errors.push(`${file}: unknown key ${key.text}`)
      for (const argument of node.arguments.slice(1)) visit(argument)
      return
    }
    if (template && (ts.isStringLiteral(node) || ts.isTemplateLiteralToken(node)) && /\p{Script=Han}/u.test(node.text)) {
      errors.push(`${file}: untranslated template expression ${node.text}`)
    }
    ts.forEachChild(node, visit)
  }
  visit(ast)
}
function inspectTemplate(file, node) {
  if (node.type === 2 && /\p{Script=Han}/u.test(node.content)) errors.push(`${file}: untranslated template text ${node.content.trim()}`)
  if (node.type === 5) inspectCode(file, node.content.content, true)
  if (node.type === 7 && node.exp) inspectCode(file, node.exp.content, ['title', 'label', 'placeholder', 'tip', 'searchLabel', 'aria-label'].includes(node.arg?.content))
  if (node.type === 6 && ['title', 'label', 'placeholder', 'tip', 'searchLabel', 'aria-label'].includes(node.name) && /\p{Script=Han}/u.test(node.value?.content || '')) {
    errors.push(`${file}: untranslated ${node.name} ${node.value.content}`)
  }
  for (const prop of node.props || []) inspectTemplate(file, prop)
  for (const child of node.children || []) inspectTemplate(file, child)
}
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      inspect(file); continue
    }
    if (!/\.(ts|vue)$/.test(entry.name)) continue
    const text = readFileSync(file, 'utf8')
    if (entry.name.endsWith('.vue')) {
      const { descriptor, errors: parseErrors } = parse(text, { filename: file })
      for (const error of parseErrors) errors.push(`${file}: ${error}`)
      for (const script of [descriptor.script, descriptor.scriptSetup]) {
        if (script) inspectCode(file, script.content)
      }
      if (descriptor.template?.ast) inspectTemplate(file, descriptor.template.ast)
    }
    else inspectCode(file, text)
  }
}
inspect(path.join(root, 'src'))
if (errors.length) {
  process.stderr.write(errors.join('\n') + '\n')
  process.exit(1)
}
process.stdout.write(`i18n: ${locales.length} locales, ${Object.keys(english).length} keys; calls and parameters match\n`)
