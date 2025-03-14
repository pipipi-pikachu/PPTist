#!/usr/bin/env node
import fs from 'fs'
import readline from 'readline'
import { Transform } from 'stream'
import isTextPath from 'is-text-path'
import JSONStream from 'JSONStream'
import split from 'split2'
import meow from 'meow'
import conventionalCommitsParser from './index.js'

const cli = meow(`
    Practice writing commit messages or parse messages from files.
    If used without specifying a text file path, you will enter an interactive shell.
    Otherwise the commit messages in the files are parsed and printed
    By default, commits will be split by three newlines ('\\n\\n\\n') or you can specify a separator.

    Usage
      conventional-commits-parser [<commit-separator>]
      conventional-commits-parser [<commit-separator>] <path> [<path> ...]
      cat <path> | conventional-commits-parser [<commit-separator>]

    Example
      conventional-commits-parser
      conventional-commits-parser log.txt
      cat log.txt | conventional-commits-parser
      conventional-commits-parser log2.txt '===' >> parsed.txt

    Options
      -p, --header-pattern              Regex to match header pattern
      -c, --header-correspondence       Comma separated parts used to define what capturing group of 'headerPattern' captures what
      -r, --reference-actions           Comma separated keywords that used to reference issues
      -i, --issue-prefixes              Comma separated prefixes of an issue
      --issue-prefixes-case-sensitive   Treat issue prefixes as case sensitive
      -n, --note-keywords               Comma separated keywords for important notes
      -f, --field-pattern               Regex to match other fields
      --revert-pattern                  Regex to match revert pattern
      --revert-correspondence           Comma separated fields used to define what the commit reverts
      -v, --verbose                     Verbose output
`, {
  importMeta: import.meta,
  flags: {
    headerPattern: {
      shortFlag: 'p',
      type: 'string'
    },
    headerCorrespondence: {
      shortFlag: 'c',
      type: 'string'
    },
    referenceActions: {
      shortFlag: 'r',
      type: 'string'
    },
    issuePrefixes: {
      shortFlag: 'i',
      type: 'string'
    },
    issuePrefixesCaseSensitive: {
      type: 'boolean'
    },
    noteKeywords: {
      shortFlag: 'n',
      type: 'string'
    },
    fieldPattern: {
      shortFlag: 'f',
      type: 'string'
    },
    revertPattern: {
      type: 'string'
    },
    revertCorrespondence: {
      type: 'string'
    },
    verbose: {
      shortFlag: 'v',
      type: 'boolean'
    }
  }
})

const filePaths = []
let separator = '\n\n\n'

cli.input.forEach((arg) => {
  if (isTextPath(arg)) {
    filePaths.push(arg)
  } else {
    separator = arg
  }
})

const length = filePaths.length
const options = cli.flags

if (options.verbose) {
  options.warn = console.log.bind(console)
}

function processFile (fileIndex) {
  const filePath = filePaths[fileIndex]
  fs.createReadStream(filePath)
    .on('error', (err) => {
      console.warn('Failed to read file ' + filePath + '\n' + err)
      if (++fileIndex < length) {
        processFile(fileIndex)
      }
    })
    .pipe(split(separator))
    .pipe(conventionalCommitsParser(options))
    .pipe(JSONStream.stringify())
    .on('end', () => {
      if (++fileIndex < length) {
        processFile(fileIndex)
      }
    })
    .pipe(process.stdout)
}

if (process.stdin.isTTY) {
  if (length > 0) {
    processFile(0)
  } else {
    let commit = ''
    const stream = new Transform({
      transform: (chunk, enc, cb) => cb(null, chunk)
    })
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    })

    stream.pipe(conventionalCommitsParser(options))
      .pipe(JSONStream.stringify('', '', ''))
      .pipe(
        new Transform({
          transform (chunk, enc, cb) {
            if (chunk.toString() === '""') {
              cb(null, 'Commit cannot be parsed\n')
            } else {
              cb(null, chunk + '\n')
            }
          }
        })
      )
      .pipe(process.stdout)

    rl.on('line', (line) => {
      commit += line + '\n'
      if (commit.indexOf(separator) === -1) {
        return
      }

      stream.write(commit)
      commit = ''
    })
  }
} else {
  options.warn = true
  process.stdin
    .pipe(split(separator))
    .pipe(conventionalCommitsParser(options))
    .on('error', (err) => {
      console.error(err.toString())
      process.exit(1)
    })
    .pipe(JSONStream.stringify())
    .pipe(process.stdout)
}
