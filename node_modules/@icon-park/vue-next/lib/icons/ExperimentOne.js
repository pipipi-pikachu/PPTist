"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('experiment-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M10.7769 30L18.019 15.0386V4H30.0283V15.0386L37.246 30",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M7.79433 43.673C6.16744 42.8855 5.48698 40.9282 6.27449 39.3013L10.7769 30C10.7769 30 18.0001 35 24.0001 30C30.0001 25 37.2461 30 37.2461 30L41.7352 39.3052C41.9492 39.7488 42.0603 40.2348 42.0603 40.7273C42.0603 42.5347 40.595 44 38.7876 44H9.22025C8.72636 44 8.23888 43.8882 7.79433 43.673Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;