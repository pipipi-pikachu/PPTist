"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('flight-safety', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M38.986 23C38.6727 33.709 33.1203 39.5222 25.002 43C20.6093 41.1187 16.9675 38.5534 14.5 34.899",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M39 19V10.2556L25.0067 5L11 10.2556V22.0285C11 24.6162 11.2942 26.9289 11.8477 29",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M9.26785 30.632C7.89464 29.3755 6.27838 26.7552 5.68058 26.6051C5.68058 26.6051 3.88327 31.0394 4.00049 34C4.11771 36.9606 6.89668 38.6351 9.82462 37.2204C12.7526 35.8057 44 20 44 20L35 18L9.26785 30.632Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M27.9998 21L18.9991 18L16.9992 19L19.9992 25",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;