"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('trapezoid', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M31.7944 8H16.2056C14.8934 8 13.7335 8.85275 13.3421 10.1052L5.21713 36.1052C4.61345 38.037 6.05665 40 8.08057 40H39.9194C41.9433 40 43.3866 38.037 42.7829 36.1052L34.6579 10.1052C34.2665 8.85275 33.1066 8 31.7944 8Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});

exports.default = _default;