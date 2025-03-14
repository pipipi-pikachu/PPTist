"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('color-card', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M10 44C13.3137 44 16 41.3137 16 38V23.5147V4H4V38C4 41.3137 6.68629 44 10 44Z",
    "fill": props.colors[1]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M10 44C13.3137 44 16 41.3137 16 38V23.5147M10 44C6.68629 44 4 41.3137 4 38V4H16V23.5147M10 44H44V32H24.4853M5.75736 42.2426C8.10051 44.5858 11.8995 44.5858 14.2426 42.2426L24.4853 32M16 23.5147L35.0147 4.5L35.4853 4L43.9853 12.5L24.4853 32",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M14.2427 42.2426L43.9853 12.5L35.4853 4L16 23.5147",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24.4853 32H44V44H12.5",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24.4853 32H44V44H12.5",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M10 44C13.3137 44 16 41.3137 16 38V23.5147V4H4V38C4 41.3137 6.68629 44 10 44Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;