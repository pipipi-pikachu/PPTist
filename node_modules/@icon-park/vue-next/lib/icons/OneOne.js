"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('one-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M25.7446 44H24.8495C19.6392 44 14.7797 41.3742 11.9243 37.016L9.72884 33.6651C8.17072 31.2869 8.63077 28.1201 10.8012 26.2836L13.0887 24.3481C13.3496 24.1273 13.5 23.8029 13.5 23.4611V7.25C13.5 5.45507 14.9551 4 16.75 4C18.5449 4 20 5.45507 20 7.25V16.25C20 14.4551 21.4551 13 23.25 13C25.0449 13 26.5 14.4551 26.5 16.25V17.75C26.5 15.9551 27.9551 14.5 29.75 14.5C31.5449 14.5 33 15.9551 33 17.75V21.75C33 19.9551 34.4551 18.5 36.25 18.5C38.0449 18.5 39.5 19.9551 39.5 21.75V31.9688C39.5 33.6177 39.0018 35.2282 38.0707 36.589L37.097 38.012C34.5331 41.7593 30.2851 44 25.7446 44Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;