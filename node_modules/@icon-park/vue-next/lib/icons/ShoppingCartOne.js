"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('shopping-cart-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("circle", {
    "cx": "20.5",
    "cy": "41.5",
    "r": "3.5",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "37.5",
    "cy": "41.5",
    "r": "3.5",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M5 6L14 12L19 34H39L44 17H25",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M25 26L32.2727 26L41 26",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;