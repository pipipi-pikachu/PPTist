"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('moving-picture', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("rect", {
    "x": "6",
    "y": "22",
    "width": "20",
    "height": "20",
    "rx": "3",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M30 6L42 6L42 18",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "34",
    "cy": "42",
    "r": "1.5",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "r": "1.5",
    "transform": "matrix(1 0 0 -1 6 14)",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "42",
    "cy": "42",
    "r": "1.5",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "r": "1.5",
    "transform": "matrix(1 0 0 -1 6 6)",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "42",
    "cy": "34",
    "r": "1.5",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "r": "1.5",
    "transform": "matrix(1 0 0 -1 14 6)",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "42",
    "cy": "26",
    "r": "1.5",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "r": "1.5",
    "transform": "matrix(1 0 0 -1 22 6)",
    "fill": props.colors[0],
    "stroke": props.colors[0]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M6 34L12.1195 29.4103C13.2239 28.5821 14.7509 28.6143 15.8192 29.4885L25 37",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M42 6L30 18",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;