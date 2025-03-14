'use strict'

const compareFunc = require('compare-func')
const { readFile } = require('fs').promises
const { resolve } = require('path')
const { DEFAULT_COMMIT_TYPES } = require('./constants')
const { addBangNotes } = require('./utils')

const releaseAsRegex = /release-as:\s*\w*@?([0-9]+\.[0-9]+\.[0-9a-z]+(-[0-9a-z.]+)?)\s*/i
/**
 * Handlebar partials for various property substitutions based on commit context.
 */
const owner = '{{#if this.owner}}{{~this.owner}}{{else}}{{~@root.owner}}{{/if}}'
const host = '{{~@root.host}}'
const repository = '{{#if this.repository}}{{~this.repository}}{{else}}{{~@root.repository}}{{/if}}'

async function createWriterOpts (config) {
  const finalConfig = {
    types: DEFAULT_COMMIT_TYPES,
    issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',
    commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
    compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
    userUrlFormat: '{{host}}/{{user}}',
    issuePrefixes: ['#'],
    ...config
  }
  const commitUrlFormat = expandTemplate(finalConfig.commitUrlFormat, {
    host,
    owner,
    repository
  })
  const compareUrlFormat = expandTemplate(finalConfig.compareUrlFormat, {
    host,
    owner,
    repository
  })
  const issueUrlFormat = expandTemplate(finalConfig.issueUrlFormat, {
    host,
    owner,
    repository,
    id: '{{this.issue}}',
    prefix: '{{this.prefix}}'
  })

  const [
    template,
    header,
    commit,
    footer
  ] = await Promise.all([
    readFile(resolve(__dirname, './templates/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/commit.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/footer.hbs'), 'utf-8')
  ])
  const writerOpts = getWriterOpts(finalConfig)

  writerOpts.mainTemplate = template
  writerOpts.headerPartial = header
    .replace(/{{compareUrlFormat}}/g, compareUrlFormat)
  writerOpts.commitPartial = commit
    .replace(/{{commitUrlFormat}}/g, commitUrlFormat)
    .replace(/{{issueUrlFormat}}/g, issueUrlFormat)
  writerOpts.footerPartial = footer

  return writerOpts
}

module.exports.createWriterOpts = createWriterOpts

function getWriterOpts (config) {
  const commitGroupOrder = config.types.flatMap(t => t.section).filter(t => t)

  return {
    transform: (commit, context) => {
      let discard = true
      const issues = []
      const entry = findTypeEntry(config.types, commit)

      // adds additional breaking change notes
      // for the special case, test(system)!: hello world, where there is
      // a '!' but no 'BREAKING CHANGE' in body:
      addBangNotes(commit)

      // Add an entry in the CHANGELOG if special Release-As footer
      // is used:
      if ((commit.footer && releaseAsRegex.test(commit.footer)) ||
          (commit.body && releaseAsRegex.test(commit.body))) {
        discard = false
      }

      commit.notes.forEach(note => {
        note.title = 'BREAKING CHANGES'
        discard = false
      })

      // breaking changes attached to any type are still displayed.
      if (discard && (entry === undefined ||
          entry.hidden)) return

      if (entry) commit.type = entry.section

      if (commit.scope === '*') {
        commit.scope = ''
      }

      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
      }

      if (typeof commit.subject === 'string') {
        // Issue URLs.
        config.issuePrefixes.join('|')
        const issueRegEx = '(' + config.issuePrefixes.join('|') + ')' + '([a-z0-9]+)'
        const re = new RegExp(issueRegEx, 'g')

        commit.subject = commit.subject.replace(re, (_, prefix, issue) => {
          issues.push(prefix + issue)
          const url = expandTemplate(config.issueUrlFormat, {
            host: context.host,
            owner: context.owner,
            repository: context.repository,
            id: issue,
            prefix
          })
          return `[${prefix}${issue}](${url})`
        })
        // User URLs.
        commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, user) => {
          // TODO: investigate why this code exists.
          if (user.includes('/')) {
            return `@${user}`
          }

          const usernameUrl = expandTemplate(config.userUrlFormat, {
            host: context.host,
            owner: context.owner,
            repository: context.repository,
            user
          })

          return `[@${user}](${usernameUrl})`
        })
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter(reference => {
        if (issues.indexOf(reference.prefix + reference.issue) === -1) {
          return true
        }

        return false
      })

      return commit
    },
    groupBy: 'type',
    // the groupings of commit messages, e.g., Features vs., Bug Fixes, are
    // sorted based on their probable importance:
    commitGroupsSort: (a, b) => {
      const gRankA = commitGroupOrder.indexOf(a.title)
      const gRankB = commitGroupOrder.indexOf(b.title)
      return gRankA - gRankB
    },
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}

function findTypeEntry (types, commit) {
  const typeKey = (commit.revert ? 'revert' : (commit.type || '')).toLowerCase()
  return types.find((entry) => {
    if (entry.type !== typeKey) {
      return false
    }
    if (entry.scope && entry.scope !== commit.scope) {
      return false
    }
    return true
  })
}

// expand on the simple mustache-style templates supported in
// configuration (we may eventually want to use handlebars for this).
function expandTemplate (template, context) {
  let expanded = template
  Object.keys(context).forEach(key => {
    expanded = expanded.replace(new RegExp(`{{${key}}}`, 'g'), context[key])
  })
  return expanded
}
