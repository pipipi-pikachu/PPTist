"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('stretching', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("g", {
    "clip-path": 'url(#' + props.id + '44a4c228' + ')'
  }, [(0, _vue.createVNode)("path", {
    "d": "M23.0005 5.99951H8.00049C6.89592 5.99951 6.00049 6.89494 6.00049 7.99951V39.9999C6.00049 41.1044 6.89592 41.9998 8.00049 41.9998H40.0005C41.1051 41.9998 42.0005 41.1044 42.0005 39.9998V24.9998",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24.001 15.9998V23.9998",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), (0, _vue.createVNode)("path", {
    "d": "M42 5.99951V13.9995",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), (0, _vue.createVNode)("path", {
    "d": "M32.001 23.9998H24.001",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), (0, _vue.createVNode)("path", {
    "d": "M42 5.99951L24 23.9995",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M42.0005 5.99951H34.0005",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]), (0, _vue.createVNode)("defs", null, [(0, _vue.createVNode)("clipPath", {
    "id": props.id + '44a4c228'
  }, [(0, _vue.createVNode)("rect", {
    "width": "48",
    "height": "48",
    "fill": props.colors[2]
  }, null)])])]);
});

exports.default = _default;