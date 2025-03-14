"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('oval-one', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("ellipse", {
    "cx": "24",
    "cy": "24",
    "rx": "14",
    "ry": "20",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});

exports.default = _default;