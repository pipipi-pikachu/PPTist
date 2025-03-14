## 1.2.3 (2024-07-14)

### Bug fixes

Add attribute type validation for headings, images, and link marks.

## 1.2.2 (2023-05-17)

### Bug fixes

Include CommonJS type declarations in the package to please new TypeScript resolution settings.

## 1.2.1 (2023-01-18)

### Bug fixes

Add parse rules to clear `em` and `strong` marks for styles that reset font style/weight.

## 1.2.0 (2022-05-30)

### New features

Include TypeScript type declarations.

## 1.1.2 (2019-11-20)

### Bug fixes

Rename ES module files to use a .js extension, since Webpack gets confused by .mjs

## 1.1.1 (2019-11-19)

### Bug fixes

The file referred to in the package's `module` field now is compiled down to ES5.

## 1.1.0 (2019-11-08)

### New features

Add a `module` field to package json file.

## 1.0.1 (2019-04-18)

### Bug fixes

Make sure images and links don't render whatever happens to be in `node.attrs` to the DOM.

## 0.19.0 (2017-03-16)

### Breaking changes

Link marks are now non-inclusive by default.

## 0.12.0 (2016-10-21)

### Bug fixes

Don't treat \<b style=font-weight: normal> as strong when parsing.
(Google Docs puts such ridiculous HTML on the clipboard.)

## 0.11.0 (2016-09-21)

### Breaking changes

Moved into a separate module.

No longer exports the [specs](https://prosemirror.net/docs/ref/version/0.11.0.html#model.NodeSpec) for the nodes and
marks separately, since they are now plain objects, not subclasses.
They are still exported through [nodes](https://prosemirror.net/docs/ref/version/0.11.0.html#schema-basic.nodes) and
[marks](https://prosemirror.net/docs/ref/version/0.11.0.html#schema-basic.marks) objects.

The list-related nodes were moved to the [schema-list](https://prosemirror.net/docs/ref/version/0.11.0.html#schema-list)
module.

