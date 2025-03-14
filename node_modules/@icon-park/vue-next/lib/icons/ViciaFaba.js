"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('vicia-faba', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("g", {
    "clip-path": 'url(#' + props.id + 'e378ed5a' + ')'
  }, [(0, _vue.createVNode)("path", {
    "d": "M3.99989 31.0001C4.00014 24.5001 8.0004 22.0374 11.0001 21.0187C13.9997 20.0001 16.0003 20.0001 18.9999 17.0001C21.9995 14.0001 22.0004 8.00008 28 6.00008C33.9995 4.00007 41.091 7.00011 42.9997 14.0001C44.9084 21.0001 39.5006 30.0001 37.0006 33.0001C34.5006 36.0001 29.4987 41.0001 20.9996 42.0001C12.5006 43.0001 3.99963 37.5001 3.99989 31.0001Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M12 21.0435C19 30 29 21.0435 22 12",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M11.0005 21.0187C14.0002 20.0001 16.0008 20.0001 19.0004 17.0001C22 14.0001 22.0009 8.00007 28.0004 6.00007",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]), (0, _vue.createVNode)("defs", null, [(0, _vue.createVNode)("clipPath", {
    "id": props.id + 'e378ed5a'
  }, [(0, _vue.createVNode)("rect", {
    "width": "48",
    "height": "48",
    "fill": props.colors[2]
  }, null)])])]);
});

exports.default = _default;