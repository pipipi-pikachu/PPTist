"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('umbrella', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M16.7273 27C19.1515 24.5758 21.5758 23.3636 24 23.3636C26.4242 23.3636 28.8485 24.5758 31.2727 27C34.101 24.5758 36.2222 23.3636 37.6364 23.3636C39.0505 23.3636 41.1717 24.5758 44 27C44 15.9543 35.0457 7 24 7C12.9543 7 4 15.9543 4 27C6.82828 24.5758 8.9495 23.3636 10.3636 23.3636C11.7778 23.3636 13.899 24.5758 16.7273 27Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24 24V38.5536C24 41.5678 26.4858 44.0112 29.5 44.0112C32.5142 44.0112 35 41.5678 35 38.5536",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24 3V7",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;