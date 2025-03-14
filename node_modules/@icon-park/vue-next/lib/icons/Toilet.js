"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('toilet', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M19.999 10H27.999V22H19.999V10Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M17.0001 35L12.0001 44H11.999H35.999L31.0001 35",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M33.999 22V5C33.999 4.44772 33.5513 4 32.999 4H14.999C14.4467 4 13.999 4.44772 13.999 5V22",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M6.07992 22.364C6.0384 22.1772 6.18056 22 6.37194 22H41.6261C41.8175 22 41.9596 22.1772 41.9181 22.3641V22.3641C40.6941 27.8723 37.2835 32.8158 31.9187 34.5641C29.4348 35.3735 26.6549 36 24.0001 36C21.3449 36 18.5642 35.3733 16.0797 34.5637C10.7148 32.8154 7.30395 27.8722 6.07992 22.364V22.364Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null)]);
});

exports.default = _default;