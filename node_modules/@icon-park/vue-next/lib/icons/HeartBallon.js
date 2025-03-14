"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('heart-ballon', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M17.3333 4C13.3333 4 12 7.15642 12 11.05C12 18.1 19.8 24.5091 24 26C28.2 24.5091 36 18.1 36 11.05C36 7.15642 34.3117 4 30.6667 4C28.4345 4 25.1944 7.0771 24 8.88889C22.8056 7.0771 19.5655 4 17.3333 4Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24 26C22 27.0909 19 29.5 19 33C19 36.5 29 35.5 29 39C29 42.5 18 44 18 44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;