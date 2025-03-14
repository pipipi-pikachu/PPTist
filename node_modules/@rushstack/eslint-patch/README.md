# @rushstack/eslint-patch

A patch that improves how ESLint loads plugins when working in a monorepo with a reusable toolchain

# modern-module-resolution

## What it does

This patch is a workaround for a longstanding [ESLint feature request](https://github.com/eslint/eslint/issues/3458)
that would allow a shared ESLint config to bring along its own plugins, rather than imposing peer dependencies
on every consumer of the config.  In a monorepo scenario, this enables your lint setup to be consolidated in a
single NPM package.  Doing so greatly reduces the copy+pasting and version management for all the other projects
that use your standard lint rule set, but don't want to be bothered with the details.

ESLint provides partial solutions such as the `--resolve-plugins-relative-to` CLI option, however they are
awkward to use.  For example, the VS Code extension for ESLint must be manually configured with this CLI option.
If some developers use other editors such as WebStorm, a different manual configuration is needed.
Also, the `--resolve-plugins-relative-to` parameter does not support multiple paths, for example if a config package
builds upon another package that also provides plugins.  See
[this discussion](https://github.com/eslint/eslint/issues/3458#issuecomment-516666620)
for additional technical background.


## Why it's a patch

ESLint's long awaited module resolver overhaul still has not materialized as of ESLint 8.  As a stopgap,
we created a small **.eslintrc.js** patch that solves the problem adequately for most real world scenarios.
This patch was proposed as an ESLint feature with [PR 12460](https://github.com/eslint/eslint/pull/12460), however
the maintainers were not able to accept it unless it is reworked into a fully correct design.  Such a requirement
would impose the same hurdles as the original GitHub issue; thus, it seems best to stay with the patch approach.

Since the patch is now in wide use, we've converted it into a proper NPM package to simplify maintenance.


## How to use it

Add a `require()` call to the to top of the **.eslintrc.js** file for each project that depends on your shared
ESLint config, for example:

**.eslintrc.js**
```ts
require("@rushstack/eslint-patch/modern-module-resolution");

// Add your "extends" boilerplate here, for example:
module.exports = {
  extends: ['@your-company/eslint-config'],
  parserOptions: { tsconfigRootDir: __dirname }
};
```

With this change, the local project no longer needs any ESLint plugins in its **package.json** file.
Instead, the hypothetical `@your-company/eslint-config` NPM package would declare the plugins as its
own dependencies.

This patch works by modifying the ESLint engine so that its module resolver will load relative to the folder of
the referencing config file, rather than the project folder.  The patch is compatible with ESLint 6, 7, and 8.
It also works with any editor extensions that load ESLint as a library.

There is a second patch in this package that removes the restriction on eslint configuration package names.
Similarly to the first, this patch is applied by adding a `require()` call to the top of the **.eslintrc.js**,
for example:

**.eslintrc.js**
```ts
require("@rushstack/eslint-patch/modern-module-resolution");
require("@rushstack/eslint-patch/custom-config-package-names"); // <-- Add this line

// Add your "extends" boilerplate here, for example:
module.exports = {
  extends: [
    '@your-company/build-rig/profile/default/includes/eslint/node' // Notice the package name does not start with "eslint-config-"
  ],
  parserOptions: { tsconfigRootDir: __dirname }
};
```

For an even leaner setup, `@your-company/eslint-config` can provide the patches as its own dependency.  See
[@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config) for a real world example
and recommended approach.

# eslint-bulk-suppressions

A tool that allows bulk suppression of ESLint warnings/errors in a large, old codebase when introducing new ESLint rules.

## What it does

This tool is designed to address the issue of introducing new ESLint rules to a large, old codebase, which often
results in hundreds to tens of thousands of retroactive issues being reported by ESLint. This can clutter the
ESLint output, making it difficult to read and potentially causing developers to overlook new ESLint issues. It
also makes it impractical to use merge request pipelines that block ESLint warnings/errors.

The tool provides a mechanism for recording all retroactively introduced ESLint warnings/errors in a
"bulk suppressions" file, hiding them from the ESLint output. This allows developers to still get most of the
benefits of ESLint, as any new code written will be annotated by ESLint and can be fixed in bite-sized portions.
It also allows the use of merge request pipelines to block newly written error-prone code without blocking legacy
code that has been battle-tested.

## Why it's a patch
The bulk suppressions feature is implemented as a monkey-patch, inspired by the modern-module-resolution
implementation. We prefer it as a patch because it allows users to opt-in to using the tool at their own discretion.
Similar to modern-module-resolution, the use case is much more pronounced in large codebases where ESLint
warnings/errors can appear at magnitudes of thousands rather than tens. Besides reducing bundle size, this also
allows us to gauge interest in this tool.

This approach inevitably results in forwards compatibility issues with versions of ESLint. The patch has
some logic to determine which version of ESLint you're using and uses the corresponding patch file.

## How to use it

To use the tool, you need to add a `require()` call to the top of the **.eslintrc.js** file for each project
that you want to use the tool with, for example:

**.eslintrc.js**
```js
require("@rushstack/eslint-patch/eslint-bulk-suppressions");

module.exports = {
  rules: {
    rule1: 'error',
    rule2: 'warning'
  },
  parserOptions: { tsconfigRootDir: __dirname }
};
```

We also highly recommend globally installing the companion CLI tool to your local system with
```bash
npm i -g @rushstack/eslint-bulk
```

The **eslint-bulk** package is a set of command line tools to use with the ESLint bulk suppressions patch.
eslint-bulk commands must be run in the same current working directory containing your package's pertaining
.eslintrc.js or .eslintrc.cjs file.

## eslint-bulk suppress

Use this command to automatically generate bulk suppressions for the given files and given rules.
Supply the paths as the main argument. The paths argument is a glob pattern that follows the same
rules as the "files" argument in the "eslint" command.

```bash
eslint-bulk suppress --rule NAME1 [--rule NAME2...] PATH1 [PATH2...]
eslint-bulk suppress --all PATH1 [PATH2...]
```

## eslint-bulk prune

Use this command to automatically delete all unused suppression entries in all .eslint-bulk-suppressions.json
files under the current working directory.

```bash
eslint-bulk prune
```

# Links

- [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/eslint/eslint-patch/CHANGELOG.md) - Find
  out what's new in the latest version

`@rushstack/eslint-patch` is part of the [Rush Stack](https://rushstack.io/) family of projects.
