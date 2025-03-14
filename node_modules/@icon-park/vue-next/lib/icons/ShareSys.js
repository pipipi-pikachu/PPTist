"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('share-sys', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M10.3654 41.6322C6.44902 37.9812 4 32.7766 4 27C4 15.9543 12.9543 7 24 7C35.0457 7 44 15.9543 44 27C44 32.7766 41.551 37.9812 37.6346 41.6322",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M15.1375 36.5109C12.5919 34.1378 11 30.7548 11 27C11 19.8203 16.8203 14 24 14C31.1797 14 37 19.8203 37 27C37 30.7548 35.4081 34.1378 32.8625 36.5109",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M19.9096 31.3897C18.7347 30.2944 18 28.733 18 27C18 23.6863 20.6863 21 24 21C27.3137 21 30 23.6863 30 27C30 28.733 29.2653 30.2944 28.0904 31.3897",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;