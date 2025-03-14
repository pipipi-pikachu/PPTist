"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('wingsuit-flying', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M24 14C26.7614 14 29 11.7614 29 9C29 6.23858 26.7614 4 24 4C21.2386 4 19 6.23858 19 9C19 11.7614 21.2386 14 24 14Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2"
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24 20C15.29 20 8 27.28 8 36H15V44H33V36H40C40.01 27.29 32.71 20 24 20Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M15 36V23",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M33 36L33 23",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24 44V20",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;