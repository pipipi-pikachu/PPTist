"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('lemon', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M36 26C36 19.5917 31.617 13.189 27 11.527L24 8L21 11.527C16.383 13.189 12 19.5917 12 26C12 32.4083 16.383 38.811 21 40.473C21.9537 40.8163 22.96 44 24 44C25.04 44 26.0463 40.8163 27 40.473C31.617 38.811 36 32.4083 36 26Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M35.1422 4.23223C36.1534 4.3613 36.7279 5.35639 36.3341 6.29667C35.8 7.57164 34.8288 9.25356 33.1962 10.1962C31.5635 11.1387 29.6213 11.1389 28.2502 10.9639C27.2389 10.8348 26.6644 9.83976 27.0582 8.89948C27.5923 7.62451 28.5635 5.94259 30.1962 5C31.8288 4.05741 33.771 4.05722 35.1422 4.23223Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});

exports.default = _default;