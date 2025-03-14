"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('bow', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M6.54363 14.2624C11.403 15.2288 16.603 18.7538 20 23C20 33.6307 12.6443 36.2369 7.22885 36.8338C5.75104 36.9966 4.77796 35.4327 5.37604 34.0715C6.82523 30.7732 8 27.2992 8 25C8 22.6087 6.09391 19.5821 4.81396 16.4265C4.3249 15.2208 5.26748 14.0087 6.54363 14.2624Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M41.4564 14.2624C36.597 15.2288 31.397 18.7538 28 23C28 33.6307 35.3557 36.2369 40.7711 36.8338C42.249 36.9966 43.222 35.4327 42.624 34.0715C41.1748 30.7732 40 27.2992 40 25C40 22.6087 41.9061 19.5821 43.186 16.4265C43.6751 15.2208 42.7325 14.0087 41.4564 14.2624Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("rect", {
    "x": "20",
    "y": "21",
    "width": "8",
    "height": "8",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;