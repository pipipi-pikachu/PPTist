"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('bee', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M30 28.6957C30 35 27.3137 44 24 44C20.6863 44 18 35 18 28.6957C18 24.9977 20.6863 22 24 22C27.3137 22 30 24.9977 30 28.6957Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M11.4783 17C13.9884 17 20 19.2386 20 22C20 24.7614 13.9884 27 11.4783 27C8.96817 27 6 24.7614 6 22C6 19.2386 8.96817 17 11.4783 17Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M36.5217 17C34.0116 17 28 19.2386 28 22C28 24.7614 34.0116 27 36.5217 27C39.0318 27 42 24.7614 42 22C42 19.2386 39.0318 17 36.5217 17Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("rect", {
    "x": "19",
    "y": "9",
    "width": "10",
    "height": "13",
    "rx": "5",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M28 10C28 6.68629 30.6863 4 34 4",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), (0, _vue.createVNode)("path", {
    "d": "M21 10C21 6.68629 17.866 4 14 4",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});

exports.default = _default;