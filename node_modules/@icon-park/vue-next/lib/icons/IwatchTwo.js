"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('iwatch-two', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M15.4167 10.5C18.2373 7.69936 21.9423 6 26 6C34.8366 6 42 14.0589 42 24C42 33.9411 34.8366 42 26 42C21.9423 42 18.2373 40.3006 15.4167 37.5",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("rect", {
    "x": "6",
    "y": "10",
    "width": "10",
    "height": "28",
    "rx": "2",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("rect", {
    "x": "13",
    "y": "18",
    "width": "4",
    "height": "4",
    "rx": "2",
    "transform": "rotate(90 13 18)",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("rect", {
    "x": "13",
    "y": "25",
    "width": "4",
    "height": "4",
    "rx": "2",
    "transform": "rotate(90 13 25)",
    "fill": props.colors[2]
  }, null)]);
});

exports.default = _default;