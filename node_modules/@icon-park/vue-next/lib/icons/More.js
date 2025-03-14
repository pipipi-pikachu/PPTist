"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('more', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("circle", {
    "cx": "12",
    "cy": "24",
    "r": "3",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "24",
    "cy": "24",
    "r": "3",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "36",
    "cy": "24",
    "r": "3",
    "fill": props.colors[0]
  }, null)]);
});

exports.default = _default;