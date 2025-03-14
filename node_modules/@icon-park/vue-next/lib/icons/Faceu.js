"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('faceu', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M39 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M27 12V16C29.6667 16.8333 36 19 36 26C36 33 30 36 24 36C18 36 12 33 12 26C12 18 21.6667 13.1667 27 12Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("ellipse", {
    "cx": "29",
    "cy": "26",
    "rx": "3",
    "ry": "4",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("ellipse", {
    "cx": "19",
    "cy": "26",
    "rx": "3",
    "ry": "4",
    "fill": props.colors[2]
  }, null)]);
});

exports.default = _default;