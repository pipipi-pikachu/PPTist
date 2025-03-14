"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('stamp', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M5 8.8L8.8 5L12.6 7.85L16.4 5L20.2 7.85L24 5L27.8 7.85L31.6 5L35.4 7.85L39.2 5L43 8.8L40.15 12.6L43 16.4L40.15 20.2L43 24L40.15 27.8L43 31.6L40.15 35.4L43 39.2L39.2 43L35.4 40.15L31.6 43L27.8 40.15L24 43L20.2 40.15L16.4 43L12.6 40.15L8.8 43L5 39.2L7.85 35.4L5 31.6L7.85 27.8L5 24L7.85 20.2L5 16.4L7.85 12.6L5 8.8Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "24",
    "cy": "24",
    "r": "9",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;