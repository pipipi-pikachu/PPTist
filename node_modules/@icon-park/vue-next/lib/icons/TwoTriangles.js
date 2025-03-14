"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('two-triangles', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M24.0002 4L41.3207 34H6.67969L24.0002 4Z",
    "fill": props.colors[1]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24.0002 44L41.3207 14H6.67969L24.0002 44Z",
    "fill": props.colors[1]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24.0002 4L41.3207 34H6.67969L24.0002 4Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24.0002 44L41.3207 14H6.67969L24.0002 44Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;