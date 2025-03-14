"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('point', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M19 41C13.5 38.25 8.00129 30 5.00063 25C1.99996 20 8.3132 15.3125 12.0004 19C15.6876 22.6875 16.0004 23 16.0004 23V7.50001C16.0004 5.56701 17.5674 4 19.5004 4C21.4334 4 23.0004 5.56701 23.0004 7.50001V16C23.0004 14.067 24.5674 12.5 26.5004 12.5C28.4334 12.5 30.0004 14.067 30.0004 16V17.5C30.0004 15.567 31.5674 14 33.5004 14C35.4334 14 37.0004 15.5655 37.0004 17.4985V22.5002C37.0004 20.5672 38.5674 19 40.5004 19C42.4334 19 44.0004 20.567 44.0004 22.5V31.2439C44.0004 32.3988 43.7376 33.5441 43.0869 34.4982C41.9179 36.2122 39.6023 39.0351 36 41C30.4999 44 24.5 43.75 19 41Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;