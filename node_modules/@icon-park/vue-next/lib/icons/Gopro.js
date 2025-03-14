"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('gopro', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("rect", {
    "x": "5",
    "y": "7",
    "width": "13",
    "height": "34",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("rect", {
    "x": "24",
    "y": "13",
    "width": "19",
    "height": "22",
    "rx": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "33.5",
    "cy": "24.5",
    "r": "3.5",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M18 24H24",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("rect", {
    "x": "9",
    "y": "15",
    "width": "5",
    "height": "5",
    "rx": "2.5",
    "fill": props.colors[0]
  }, null)]);
});

exports.default = _default;