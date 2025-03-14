"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('hand-down', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M7.05322 10.0005L29.0532 10.0005V4.00049L7.05322 4.00049V10.0005Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M29.0531 10.0005C35.5721 17.1234 39.3127 21.2513 40.2749 22.3843C41.7183 24.0837 41.1122 26.0045 37.5001 26.0045C33.8879 26.0045 31.8047 20.7191 29.0531 20.7191C29.0367 20.7157 29.0356 27.4748 29.0498 40.9964C29.0515 42.6538 27.7094 43.9987 26.0521 44.0005L26.0489 44.0005C24.3898 44.0005 23.0447 42.6555 23.0447 40.9963V32.9869C15.072 31.7781 10.7374 31.1111 10.0411 30.9861C8.99656 30.7986 7.05308 29.8015 7.05308 26.9325C7.05308 25.0198 7.05308 20.0424 7.05308 10.0005L29.0531 10.0005Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;