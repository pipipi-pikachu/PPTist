"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('eight-key', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("rect", {
    "x": "6",
    "y": "6",
    "width": "36",
    "height": "36",
    "rx": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24 22C26.2091 22 28 20.2091 28 18C28 15.7909 26.2091 14 24 14C21.7909 14 20 15.7909 20 18C20 20.2091 21.7909 22 24 22Z",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24 33C26.7614 33 29 30.7614 29 28C29 25.2386 26.7614 23 24 23C21.2386 23 19 25.2386 19 28C19 30.7614 21.2386 33 24 33Z",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth
  }, null)]);
});

exports.default = _default;