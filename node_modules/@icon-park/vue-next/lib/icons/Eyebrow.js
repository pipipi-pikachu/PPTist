"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('eyebrow', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M24 40C33.9411 40 42 30 42 30C42 30 33.9411 20 24 20C14.0589 20 6 30 6 30C6 30 14.0589 40 24 40Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24 34C26.2091 34 28 32.2091 28 30C28 27.7909 26.2091 26 24 26C21.7909 26 20 27.7909 20 30C20 32.2091 21.7909 34 24 34Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M28.0001 6C21 6 10.0001 9.5 7.00005 12C4.00005 14.5 5.99999 19 8.00005 18C10.0001 17 23.2001 12.2 28.0001 11C32.8001 9.8 39.6667 11.8333 42 13C39.6667 11 35.0001 6 28.0001 6Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;