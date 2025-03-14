"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('six', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M18.9995 41C13.4995 38.25 8.0008 30 5.00014 25C1.99947 20 8.31271 15.3125 11.9999 19C15.6871 22.6875 15.9999 23 15.9999 23V17.5C15.9999 15.567 17.5669 14 19.4999 14C21.4329 14 22.9999 15.567 22.9999 17.5V16C22.9999 14.067 24.5669 12.5 26.4999 12.5C28.4329 12.5 29.9999 14.067 29.9999 16V17.5C29.9999 15.567 31.5669 14 33.4999 14C35.4329 14 36.9999 15.567 36.9999 17.5V7.5C36.9999 5.567 38.5669 4 40.4999 4C42.4329 4 43.9999 5.567 43.9999 7.5V28.9663C43.9999 30.9689 43.6297 32.9743 42.5445 34.6573C41.2626 36.6453 39.1111 39.3028 35.9995 41C30.4994 44 24.4995 43.75 18.9995 41Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;