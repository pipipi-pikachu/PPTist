"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('subway', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("rect", {
    "x": "8",
    "y": "6",
    "width": "32",
    "height": "26",
    "rx": "2",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "14",
    "cy": "27",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "34",
    "cy": "27",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("rect", {
    "x": "14",
    "y": "12",
    "width": "20",
    "height": "10",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M32 32L40 41",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M17 32L8 41",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;