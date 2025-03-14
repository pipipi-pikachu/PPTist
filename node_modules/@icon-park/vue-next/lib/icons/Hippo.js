"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('hippo', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("rect", {
    "x": "7",
    "y": "25",
    "width": "34",
    "height": "18",
    "rx": "6",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "17",
    "cy": "34",
    "r": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "31",
    "cy": "34",
    "r": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M11 19C11 15.6863 13.6863 13 17 13H31C34.3137 13 37 15.6863 37 19V25H11V19Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "20",
    "cy": "19",
    "r": "2",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "28",
    "cy": "19",
    "r": "2",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M18 5C19.6569 5 21 6.34315 21 8L21 13L15 13L15 8C15 6.34315 16.3431 5 18 5Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M30 5C31.6569 5 33 6.34315 33 8L33 13L27 13L27 8C27 6.34315 28.3431 5 30 5Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;