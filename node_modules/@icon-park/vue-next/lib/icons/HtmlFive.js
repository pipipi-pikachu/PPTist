"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('html-five', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M37.8037 5H10.1963C9.01796 5 8.09502 6.01352 8.205 7.18668L10.8925 35.8534C10.959 36.5632 11.3984 37.1839 12.0457 37.4826L23.1619 42.6132C23.6937 42.8586 24.3063 42.8586 24.8381 42.6132L35.9543 37.4826C36.6016 37.1839 37.041 36.5632 37.1075 35.8534L39.795 7.18668C39.905 6.01352 38.982 5 37.8037 5Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M32 12H16L17 21H31L30 32L24 35L18 32L17.5 27",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;