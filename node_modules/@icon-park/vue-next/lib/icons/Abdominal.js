"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('abdominal', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M7.89926 5C10.7371 8.01931 12.156 11.9408 12.156 16.7645C12.156 24 5.9995 29.5382 4.969 33.5C4.282 36.1412 3.95884 39.3078 3.9995 43",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), (0, _vue.createVNode)("path", {
    "d": "M39.256 5C36.4182 8.01931 34.9992 11.9408 34.9992 16.7645C34.9992 24 41.1558 29.5382 42.1863 33.5C42.8733 36.1412 43.1964 39.3078 43.1558 43",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), (0, _vue.createVNode)("path", {
    "d": "M6.24414 30.8369C12.7693 34.9668 18.6949 37.0317 24.0211 37.0317C29.3472 37.0317 34.9799 34.9668 40.9192 30.8369",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24 31C25.3807 31 26.5 29.8807 26.5 28.5C26.5 27.1193 25.3807 26 24 26C22.6193 26 21.5 27.1193 21.5 28.5C21.5 29.8807 22.6193 31 24 31Z",
    "fill": props.colors[0]
  }, null)]);
});

exports.default = _default;