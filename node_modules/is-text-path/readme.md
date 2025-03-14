# is-text-path [![Build Status](https://travis-ci.org/sindresorhus/is-text-path.svg?branch=master)](https://travis-ci.org/sindresorhus/is-text-path)

> Check if a file path is a text file


## Install

```
$ npm install is-text-path
```


## Usage

```js
const isTextPath = require('is-text-path');

isTextPath('source/unicorn.txt');
//=> true

isTextPath('source/unicorn.png');
//=> false
```


## Related

- [`text-extensions`](https://github.com/sindresorhus/text-extensions) - List of text file extensions
- [`is-binary-path`](https://github.com/sindresorhus/is-binary-path) - Check if a file path is a binary file


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
