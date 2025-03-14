'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var transformStream = require('./transformStream.js');
var tXml = require('./txml.js');
require('through2');



exports.transformStream = transformStream.transformStream;
exports.filter = tXml.filter;
exports.getElementById = tXml.getElementById;
exports.getElementsByClassName = tXml.getElementsByClassName;
exports.parse = tXml.parse;
exports.simplify = tXml.simplify;
exports.simplifyLostLess = tXml.simplifyLostLess;
exports.stringify = tXml.stringify;
exports.toContentString = tXml.toContentString;
