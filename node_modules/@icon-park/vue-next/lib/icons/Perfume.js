"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('perfume', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("rect", {
    "x": "16",
    "y": "4",
    "width": "16",
    "height": "10",
    "rx": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("rect", {
    "x": "6",
    "y": "20",
    "width": "36",
    "height": "24",
    "rx": "12",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M6 32.9999C9.04225 29.1325 18 29.9999 24 31.9999C30 33.9999 38 36.9999 42 31.9999",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M25 8.99999C25 9.55228 24.5523 9.99999 24 9.99999C23.4477 9.99999 23 9.55228 23 8.99999C23 8.44771 23.4477 7.99999 24 7.99999C24.5523 7.99999 25 8.44771 25 8.99999Z",
    "fill": props.colors[2]
  }, null)]);
});

exports.default = _default;