/**
Check if a file path is a text file.

@example
```
import isTextPath = require('is-text-path');

isTextPath('source/unicorn.txt');
//=> true

isTextPath('source/unicorn.png');
//=> false
```
*/
declare function isTextPath(filepath: string): boolean;

export = isTextPath;
