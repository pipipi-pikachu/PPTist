"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('phone-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("rect", {
    "x": "5",
    "y": "5",
    "width": "38",
    "height": "38",
    "rx": "3",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("rect", {
    "x": "11",
    "y": "12",
    "width": "8",
    "height": "24",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("rect", {
    "x": "25",
    "y": "12",
    "width": "12",
    "height": "6",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "25",
    "cy": "24",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "25",
    "cy": "30",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "25",
    "cy": "36",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "31",
    "cy": "24",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "31",
    "cy": "30",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "31",
    "cy": "36",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "37",
    "cy": "24",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "37",
    "cy": "30",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "37",
    "cy": "36",
    "r": "2",
    "fill": props.colors[0]
  }, null)]);
});

exports.default = _default;