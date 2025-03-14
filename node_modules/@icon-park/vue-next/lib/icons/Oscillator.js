"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('oscillator', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M7 9V24C7 27.3137 9.68629 30 13 30H35C38.3137 30 41 27.3137 41 24V9",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M7 10C7 6.68629 9.68629 4 13 4H35C38.3137 4 41 6.68629 41 10C41 13.3137 38.3137 16 35 16H13C9.68629 16 7 13.3137 7 10Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "15",
    "cy": "10",
    "r": "2",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "21",
    "cy": "10",
    "r": "2",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "27",
    "cy": "10",
    "r": "2",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "33",
    "cy": "10",
    "r": "2",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M19 30V44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M29 30V44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;