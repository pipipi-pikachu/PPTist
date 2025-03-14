# conventional-changelog-conventionalcommits

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[npm]: https://img.shields.io/npm/v/conventional-changelog-conventionalcommits.svg
[npm-url]: https://npmjs.com/package/conventional-changelog-conventionalcommits

[node]: https://img.shields.io/node/v/conventional-changelog-conventionalcommits.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/conventional-changelog-conventionalcommits
[deps-url]: https://libraries.io/npm/conventional-changelog-conventionalcommits/tree

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/ci.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

A concrete implementation of the specification described at [conventionalcommits.org](https://conventionalcommits.org/) for automated CHANGELOG generation and version management.

## Install

```bash
# yarn
yarn add -D conventional-changelog-conventionalcommits
# pnpm
pnpm add -D conventional-changelog-conventionalcommits
# npm
npm i -D conventional-changelog-conventionalcommits
```

## Indirect Usage (as preset)

Use the [Conventional Changelog CLI Quick Start](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli#quick-start) with the `-p conventionalcommits` option.

## Direct Usage (as a base preset so you can customize it)

If you want to use this package directly and pass options, you can use the [Conventional Changelog CLI Quick Start](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli#quick-start) and with the `--config` or `-n` parameter, pass a js config that looks like this:

```js
const createPreset = require('conventional-changelog-conventionalcommits')

createPreset({
  issuePrefixes: ['TEST-'],
  issueUrlFormat: 'https://myBugTracker.com/{{prefix}}{{id}}'
}).then((config) => {
  // do something with the config
})
```

or json config like that:

```json
{
  "options": {
    "preset": {
      "name": "conventionalchangelog",
      "issuePrefixes": ["TEST-"],
      "issueUrlFormat": "https://myBugTracker.com/{{prefix}}{{id}}"
    }
  }
}
```

This last json config way passes the `preset` object to the `conventional-changelog-preset-loader` package, that in turn, passes this same `preset` object as the config for the `conventional-changelog-conventionalcommits`.

See [conventional-changelog-config-spec](https://github.com/conventional-changelog/conventional-changelog-config-spec) for available configuration options.
