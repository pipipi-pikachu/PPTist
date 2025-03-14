"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('tickets-two', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M30 30C33 30 35 31.8809 35 34L41 34L41 4L35 4C35 6 33 8 30 8C27 8 25 6 25 4L19 4L19 18",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M30 44L24 44C24 41.8809 22 40 19 40C16 40 14 41.8809 14 44L8 44L8 14L14 14C14 16 16 18 19 18C22 18 24 16 24 14L30 14L30 44Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "14",
    "cy": "24",
    "r": "2",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "19",
    "cy": "24",
    "r": "2",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "24",
    "cy": "24",
    "r": "2",
    "fill": props.colors[2]
  }, null)]);
});

exports.default = _default;