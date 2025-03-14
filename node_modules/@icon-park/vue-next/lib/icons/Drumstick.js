"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('drumstick', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M14.1508 33.8198L12.7366 43.7193L4.25135 35.234L14.1508 33.8198Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24.0498 6.9502L14.1503 16.8497C9.46402 21.536 9.46402 29.134 14.1503 33.8203V33.8203C18.8366 38.5065 26.4346 38.5065 31.1209 33.8203L41.0204 23.9208",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("ellipse", {
    "cx": "32.5355",
    "cy": "15.435",
    "rx": "12",
    "ry": "7",
    "transform": "rotate(45 32.5355 15.435)",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "30.0605",
    "cy": "11.3983",
    "r": "2",
    "transform": "rotate(45 30.0605 11.3983)",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "37.1318",
    "cy": "18.4691",
    "r": "2",
    "transform": "rotate(45 37.1318 18.4691)",
    "fill": props.colors[2]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "31.4746",
    "cy": "17.055",
    "r": "2",
    "transform": "rotate(45 31.4746 17.055)",
    "fill": props.colors[2]
  }, null)]);
});

exports.default = _default;