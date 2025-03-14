"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('youtobe', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M44 32.7679V15.2321C44 13.9073 43.1298 12.7428 41.8448 12.4204C38.3687 11.5484 31.1843 10 24 10C16.8157 10 9.63134 11.5484 6.15517 12.4204C4.87016 12.7428 4 13.9073 4 15.2321V32.7679C4 34.0927 4.87016 35.2572 6.15517 35.5796C9.63133 36.4516 16.8157 38 24 38C31.1843 38 38.3687 36.4516 41.8448 35.5796C43.1298 35.2572 44 34.0927 44 32.7679Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M22.5735 29.8986C21.9107 30.3625 21 29.8884 21 29.0793V18.9207C21 18.1116 21.9107 17.6375 22.5735 18.1014L29.8297 23.1808C30.3984 23.5789 30.3984 24.4211 29.8297 24.8192L22.5735 29.8986Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;