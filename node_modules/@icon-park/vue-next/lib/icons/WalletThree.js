"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('wallet-three', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M39 16V9C39 7.34315 37.6569 6 36 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34314 42 9 42H36C37.6569 42 39 40.6569 39 39V32",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("rect", {
    "x": "22",
    "y": "16",
    "width": "20",
    "height": "16",
    "rx": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "r": "2",
    "transform": "matrix(-1.31134e-07 -1 -1 1.31134e-07 30 24)",
    "fill": props.colors[2]
  }, null)]);
});

exports.default = _default;