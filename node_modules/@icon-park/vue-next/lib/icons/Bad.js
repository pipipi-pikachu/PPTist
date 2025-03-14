"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('bad', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M9.9478 28.8071C13.8691 37.6813 21.9325 41.1902 28 44.0001C30.6324 45.2192 31.3283 40.2832 30.2772 37.3091C29.3933 34.8081 27.6256 32.0048 27.6256 32.0048H34.7316C36.665 32.0048 38.2322 30.4376 38.2322 28.5042C38.2322 26.5709 36.665 25.0036 34.7316 25.0036H36.4994C38.4327 25.0036 40 23.4364 40 21.5031C40 19.5697 38.4327 18.0025 36.4994 18.0025H32.9639C34.8972 18.0025 36.4644 16.4352 36.4644 14.5019C36.4644 12.5685 34.8972 11.0013 32.9639 11.0013H30.3122C32.2455 11.0013 33.8128 9.43401 33.8128 7.50068C33.8128 5.56735 32.2481 4.00008 30.3148 4.00008H19.6706C16.577 4.00008 12.5995 5.80317 9.9478 10.8044C7.40591 15.5985 7.29614 22.8061 9.9478 28.8071Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;