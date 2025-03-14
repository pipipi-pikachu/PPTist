"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('swallow', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M8.99902 33.3135L24.0339 6.94269C24.958 4.9809 26.6267 4 29.0402 4C32.6603 4 35.0172 8.98626 35.0172 8.98626C35.0172 8.98626 36.3445 9.18401 38.999 9.57953C34.9888 9.64514 32.6699 10.452 32.0424 12C31.1012 14.3221 34.4983 16.7308 35.0172 20.0039C35.5361 23.2769 33.4663 28.8051 28.4882 31.567C25.1694 33.4083 21.0262 33.8859 16.0583 33L9.95844 44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M18.9424 27.978C21.5213 23.3284 23.2169 20.3429 24.0293 19.0215C25.2478 17.0394 30.2745 17.637 28.4685 22.5843C27.2645 25.8824 24.0891 27.6803 18.9424 27.978Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;