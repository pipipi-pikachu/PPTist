"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('healthy-recognition', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M6 33V39C6 40.6569 7.34315 42 9 42H15",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M33 42H39C40.6569 42 42 40.6569 42 39V33",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M42 15V9C42 7.34315 40.6569 6 39 6H33",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M6 15V9C6 7.34315 7.34315 6 9 6H15",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M34 24.0001L24 34.0001C24 34.0001 15.0002 25.0001 14 24.0001C12.9998 23.0001 12.5 21.0001 14 19.0001C15.5 17.0001 18.5 17.0001 20 18.0001C21.5001 19.0001 22.0001 20.0001 24 20.0001C26 20.0001 26.5001 19.0001 28 18.0001C29.5 17.0001 32.5003 17.0001 34.0003 19.0001C35.5003 21.0001 35 23.0001 34 24.0001Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;