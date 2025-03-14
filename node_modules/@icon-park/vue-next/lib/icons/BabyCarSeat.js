"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('baby-car-seat', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M36 33L42 4C42 4 31.5 6 31.5 10C31.5 12.5 35.5 14 34 15.5C32.5 17 27 18.5 27 22.5C27 25 28.6406 26.8594 27 28.5C25.5 30 24 29.2143 21.5 28.5C18.7 27.7 13 27 11 27.5C9 28 6.99997 29 7 32C7.00001 33.6492 8 35.5 10.5 36C13 36.5 16 34 20 34C24 34 29 37 32 37C35 37 36 33 36 33Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M11 36L8 44H41L35 36",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;