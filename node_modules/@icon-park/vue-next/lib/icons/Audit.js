"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('audit', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M8 36L8.00461 28.0426C8.00551 27.4906 8.45313 27.0432 9.00519 27.0426C12.3391 27.0426 15.6731 27.0426 19.0071 27.0426C19.9286 27.0426 19.9237 26.2252 19.9237 24.2792C19.9237 22.3332 15.0221 20.6941 15.0221 13.8528C15.0221 7.01151 20.0999 5 24.32 5C28.5401 5 33.1366 7.01151 33.1366 13.8528C33.1366 20.6941 28.2607 21.7818 28.2607 24.2792C28.2607 26.7765 28.2607 27.0426 29.0413 27.0426C32.3609 27.0426 35.6806 27.0426 39.0003 27.0426C39.5525 27.0426 40.0003 27.4904 40.0003 28.0426V36H8Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M8 42H40",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;