"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('rock-gesture', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M24 25C24 25 24 8.5 24 7.5C24 6.21875 24.5 4 27 4C29.5 4 30 6.21875 30 7.5C30 8 30 30 30 30C30 30 35.7031 24.2969 37 23C38.2969 21.7031 40.0781 21.0781 41.5 22.5C42.9219 23.9219 43.0938 25.4063 41.5 27C39.9063 28.5937 35 33.5 35 33.5C35 33.5 29.0938 44 26 44C22.9063 44 13 44 13 44C13 44 10 44 8.00002 42C6.00002 40 6.00002 37.5 6.00002 37.5C6.00002 37.5 5.99998 13.5 6.00002 12.7812C6.00005 12.0625 6.50002 10 9.00002 10C11.5 10 12 12 12 12.7812C12 13.5 12 25 12 25",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("rect", {
    "x": "12",
    "y": "19",
    "width": "6",
    "height": "12",
    "rx": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("rect", {
    "x": "18",
    "y": "19",
    "width": "6",
    "height": "12",
    "rx": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;