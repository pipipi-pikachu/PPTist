"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('washing-machine', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 49 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("rect", {
    "x": "8.77783",
    "y": "4",
    "width": "32",
    "height": "40",
    "rx": "2",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M8.77783 15.5H40.7778",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "28.7778",
    "cy": "10",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "34.7778",
    "cy": "10",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "24.7778",
    "cy": "30",
    "r": "7",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});

exports.default = _default;