"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('vip-one', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M4.50326 16.3661L12.5158 7.67177C12.909 7.2452 13.4807 7 14.0821 7H33.9179C34.5193 7 35.091 7.2452 35.4842 7.67177L43.4967 16.3661C44.1809 17.1084 44.1659 18.2125 43.4618 18.9383L24.7499 40.1499C24.3518 40.6012 23.6482 40.6012 23.2501 40.1499L4.5382 18.9383C3.83415 18.2125 3.81915 17.1084 4.50326 16.3661Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M16 20L24 29L32 20",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;