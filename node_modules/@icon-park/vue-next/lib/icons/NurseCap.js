"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('nurse-cap', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M24 10C12.7433 10 5.98524 16.7481 4.37521 18.5579C4.1348 18.8281 4.0869 19.2064 4.22726 19.5397L11.5526 36.9373C11.7887 37.4982 12.4705 37.7313 13.0196 37.4691C14.8237 36.6075 18.876 35 24 35C29.124 35 33.1763 36.6075 34.9804 37.4691C35.5295 37.7313 36.2113 37.4982 36.4474 36.9373L43.7727 19.5397C43.9131 19.2064 43.8652 18.8281 43.6248 18.5579C42.0148 16.7481 35.2568 10 24 10Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M20 24.001L28 24.001",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24 20V28",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;