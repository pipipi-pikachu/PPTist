"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('easy', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M33 41C27.5203 44.0026 23 44 17 42C10.9236 39.9745 7 33 7 28C7 25.2562 11.1135 23.6282 12.5286 23.1494C12.8074 23.055 13 22.7966 13 22.5023V15C13 13.067 14.567 11.5 16.5 11.5C18.433 11.5 20 13.067 20 15V12.5C20 10.567 21.567 9 23.5 9C25.433 9 27 10.567 27 12.5V15C27 13.067 28.567 11.5 30.5 11.5C32.433 11.5 34 13.067 34 15V7.49999C34 5.567 35.567 4 37.5 4C39.433 4 41 5.567 41 7.49999V28.2319C41 30.7041 40.4077 33.1603 38.962 35.1657C37.4919 37.2049 35.3574 39.7083 33 41Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;