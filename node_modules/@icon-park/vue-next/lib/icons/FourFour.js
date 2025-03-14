"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('four-four', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M25.7446 44H24.8495C19.6392 44 14.7797 41.3742 11.9243 37.016L9.72884 33.6651C8.17072 31.2869 8.63077 28.1201 10.8012 26.2836L13.0887 24.3481C13.3496 24.1273 13.5 23.8029 13.5 23.4611V7.25C13.5 5.45507 14.9551 4 16.75 4C18.5449 4 20 5.45508 20 7.25V6.25C20 4.45507 21.4551 3 23.25 3C25.0449 3 26.5 4.45508 26.5 6.25V7.25C26.5 5.45507 27.9551 4 29.75 4C31.5449 4 33 5.45508 33 7.25V11.25C33 9.45507 34.4551 8 36.25 8C38.0449 8 39.5 9.45507 39.5 11.25V30.3077C39.5 33.0387 38.6618 35.7251 37.1196 37.979C34.5557 41.7263 30.2851 44 25.7446 44Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;