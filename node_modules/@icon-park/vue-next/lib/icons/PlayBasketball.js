"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('play-basketball', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M32 16C34.7614 16 37 13.7614 37 11C37 8.23858 34.7614 6 32 6C29.2386 6 27 8.23858 27 11C27 13.7614 29.2386 16 32 16Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2"
  }, null), (0, _vue.createVNode)("path", {
    "d": "M23 40L31.11 37.94C31.89 37.75 32.13 36.75 31.53 36.22L23 29L27 21L16.59 17.26C16.09 17.08 15.69 16.72 15.46 16.24L11 8",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M23 29L16.0301 37.79C15.8201 38.04 15.5601 38.24 15.2601 38.36L5 42",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M27 21L36.9 23.79C37.37 23.93 37.78 24.23 38.04 24.64L42 31",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z",
    "fill": props.colors[0]
  }, null)]);
});

exports.default = _default;