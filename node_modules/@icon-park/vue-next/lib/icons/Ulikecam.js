"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('ulikecam', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M22 44C31.9411 44 40 35.9411 40 26C40 16.0589 31.9411 8 22 8C12.0589 8 4 16.0589 4 26C4 35.9411 12.0589 44 22 44Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M41 10C42.6569 10 44 8.65685 44 7C44 5.34315 42.6569 4 41 4C39.3431 4 38 5.34315 38 7C38 8.65685 39.3431 10 41 10Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});

exports.default = _default;