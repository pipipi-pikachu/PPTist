"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('hamburger-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M40 22V21C40 12.1634 32.8366 5 24 5C15.1634 5 8 12.1634 8 21V22",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M8 34C8 34 6 39 10 41C14 43 34 43 38 41C42 39 40 34 40 34",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("rect", {
    "x": "5",
    "y": "21",
    "width": "38",
    "height": "14",
    "rx": "7",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M11 29L12.5917 28.2042C14.1235 27.4382 15.9098 27.3639 17.5 28L17.9239 28.1695C19.2444 28.6978 20.7279 28.6361 22 28V28C23.2721 27.3639 24.7556 27.3022 26.0761 27.8305L27.0353 28.2141C28.285 28.714 29.6888 28.6556 30.8927 28.0537V28.0537C32.2193 27.3904 33.7807 27.3904 35.1073 28.0537L37 29",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "17",
    "cy": "15.0498",
    "r": "2.5",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "23.75",
    "cy": "12.2998",
    "r": "2.5",
    "fill": props.colors[0]
  }, null)]);
});

exports.default = _default;