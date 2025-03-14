"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('charging-treasure', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M9.97506 8.55657C10.1946 7.08729 11.4565 6 12.9421 6H35.9778C37.4979 6 38.7778 7.13694 38.9569 8.64644L42.102 35.1464C42.3138 36.9309 40.9199 38.5 39.1229 38.5H8.98167C7.14822 38.5 5.74362 36.8699 6.01462 35.0566L9.97506 8.55657Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("rect", {
    "x": "6",
    "y": "30",
    "width": "36",
    "height": "12",
    "rx": "6",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("rect", {
    "x": "19",
    "y": "34",
    "width": "4",
    "height": "4",
    "rx": "2",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M29 36H35",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M22 12H26",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;