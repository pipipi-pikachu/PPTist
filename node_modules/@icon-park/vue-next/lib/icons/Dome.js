"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('dome', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M4 43H44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M5 24C5 24 14 23 24 23C34 23 43 24 43 24",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M6 18C6 18 15.0526 14 24 14C32.9474 14 42 18 42 18",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M5 30C5 30 14 32 24 32C34 32 43 30 43 30",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24 6C12.9543 6 4 14.9543 4 26C4 33.8085 7.47484 39.7064 14 43H34C40.5252 39.7064 44 33.8085 44 26C44 14.9543 35.0457 6 24 6Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24 6C20.134 6 17 14.9543 17 26C17 33.1773 18.0125 39.4716 20 43H28C29.9875 39.4716 31 33.1773 31 26C31 14.9543 27.866 6 24 6Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});

exports.default = _default;