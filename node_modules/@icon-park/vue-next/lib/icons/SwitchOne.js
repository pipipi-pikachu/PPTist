"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('switch-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("circle", {
    "cx": "24",
    "cy": "24",
    "r": "19",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("rect", {
    "x": "36.0063",
    "y": "19.3335",
    "width": "10.5189",
    "height": "24.0125",
    "rx": "5.25944",
    "transform": "rotate(90 36.0063 19.3335)",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("rect", {
    "x": "36.0063",
    "y": "29.8525",
    "width": "10",
    "height": "10",
    "rx": "5",
    "transform": "rotate(-180 36.0063 29.8525)",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth
  }, null)]);
});

exports.default = _default;