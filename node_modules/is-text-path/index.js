'use strict';
const path = require('path');
const textExtensions = require('text-extensions');

const extensions = new Set(textExtensions);

module.exports = filePath => extensions.has(path.extname(filePath).slice(1).toLowerCase());
