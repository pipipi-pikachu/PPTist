"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('thumbs-down', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M20.3793 29.4002V36.6002C20.3793 39.5826 22.7969 42.0002 25.7793 42.0002L32.9793 25.8002V6.00023H12.0633C10.2682 5.97994 8.73244 7.2853 8.46327 9.06023L5.97927 25.2602C5.82077 26.3045 6.12885 27.3657 6.82192 28.1627C7.51499 28.9597 8.52311 29.4122 9.57927 29.4002H20.3793Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M32.9795 6.00017H37.7855C39.8942 5.96288 41.6968 7.51019 41.9795 9.60017V22.2002C41.6968 24.2901 39.8942 26.0375 37.7855 26.0002H32.9795V6.00017Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;