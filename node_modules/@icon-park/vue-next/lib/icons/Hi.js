"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('hi', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M37 43H17.476C17.3873 43 17.3049 42.9541 17.2581 42.8788L7.86011 27.7273C6.79115 26.0039 7.14475 23.7577 8.69148 22.446C10.6306 20.8016 13.584 21.3036 14.871 23.4963L17.3333 27.6914V8.57577C17.3333 6.71037 19.0177 5.29724 20.8547 5.62142L37.5214 8.56259C38.9549 8.81558 40 10.0612 40 11.5169V17.8148V40C40 41.6569 38.6569 43 37 43Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;