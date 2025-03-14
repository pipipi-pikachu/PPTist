"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('avocado-one', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M7 32C10 37 15 40 20 41C25 42 30.8085 41.1437 35 38C41 33.5 43 26 43 21C43 16 41 10.5 40 9C39 7.5 37 7 37 7",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M21.0002 12.9999C16.6452 14.6045 12 12.9999 8.00015 15.9999C3.30352 19.5225 1.99983 24.9999 5.00015 29.9999C7.35207 33.9193 10.9997 35.9999 16.9997 35.9999C22.9997 35.9999 26.7643 34.2353 30.9997 29.9999C36.9997 23.9999 38.9997 14.4999 38.9997 10.9999C38.9997 7.49987 36.5 5.49986 32.9997 5.99986C29.4994 6.49986 26.5726 10.9466 21.0002 12.9999Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M21.9452 20.1174C20.7223 20.5976 19.4178 20.1174 18.2945 21.0152C16.9755 22.0693 16.6094 23.7083 17.452 25.2045C18.1125 26.3774 19.1368 27 20.8218 27C22.5068 27 23.564 26.472 24.7534 25.2045C26.4383 23.4091 27 20.5663 27 19.519C27 18.4716 26.298 17.8731 25.315 18.0228C24.3321 18.1724 23.5101 19.503 21.9452 20.1174Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;