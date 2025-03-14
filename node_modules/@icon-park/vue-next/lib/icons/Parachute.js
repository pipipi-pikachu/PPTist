"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('parachute', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M16.7273 24C19.1515 21.5758 21.5758 20.3636 24 20.3636C26.4242 20.3636 28.8485 21.5758 31.2727 24C34.101 21.5758 36.2222 20.3636 37.6364 20.3636C39.0505 20.3636 41.1717 21.5758 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C6.82828 21.5758 8.9495 20.3636 10.3636 20.3636C11.7778 20.3636 13.899 21.5758 16.7273 24Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M4 24L24 44L16.7273 24",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M31.2727 24L24 44L44 24",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;