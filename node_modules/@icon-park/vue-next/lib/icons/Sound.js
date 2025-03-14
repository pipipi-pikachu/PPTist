"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('sound', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("rect", {
    "x": "8",
    "y": "4",
    "width": "32",
    "height": "40",
    "rx": "2",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "24",
    "cy": "15",
    "r": "5",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "14",
    "cy": "10",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "14",
    "cy": "38",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "34",
    "cy": "10",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "34",
    "cy": "38",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "24",
    "cy": "32",
    "r": "6",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});

exports.default = _default;