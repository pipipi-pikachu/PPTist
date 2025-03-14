# read-pkg

> Read a package.json file

## Why

- [Throws more helpful JSON errors](https://github.com/sindresorhus/parse-json)
- [Normalizes the data](https://github.com/npm/normalize-package-data#what-normalization-currently-entails)

## Install

```sh
npm install read-pkg
```

## Usage

```js
import {readPackage} from 'read-pkg';

console.log(await readPackage());
//=> {name: 'read-pkg', …}

console.log(await readPackage({cwd: 'some-other-directory'}));
//=> {name: 'unicorn', …}
```

## API

### readPackage(options?)

Returns a `Promise<object>` with the parsed JSON.

### readPackageSync(options?)

Returns the parsed JSON.

#### options

Type: `object`

##### cwd

Type: `URL | string`\
Default: `process.cwd()`

Current working directory.

##### normalize

Type: `boolean`\
Default: `true`

[Normalize](https://github.com/npm/normalize-package-data#what-normalization-currently-entails) the package data.

### parsePackage(packageFile, options?)

Parses an object or string into JSON.

Note: `packageFile` is cloned using [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) to prevent modification to the input object. This function is available from Node.js 18 on. In environments without `structuredClone` (such as Node.js 16), a shallow spread is used instead, which can cause deep properties of the object to be modified. Consider cloning the object before using `parsePackage` if that's the case.

#### packageFile

Type: `object | string`

An object or a stringified object to be parsed as a package.json.

#### options

Type: `object`

##### normalize

Type: `boolean`\
Default: `true`

[Normalize](https://github.com/npm/normalize-package-data#what-normalization-currently-entails) the package data.

## Related

- [read-pkg-up](https://github.com/sindresorhus/read-pkg-up) - Read the closest package.json file
- [write-pkg](https://github.com/sindresorhus/write-pkg) - Write a `package.json` file
- [load-json-file](https://github.com/sindresorhus/load-json-file) - Read and parse a JSON file
