"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('shrimp', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M20.6234 11H38.9996C38.9996 11 38.9996 16 35.9996 19C32.9996 22 30 23 29 23C28 23 18.5 24 16 26C13.5 28 12.0011 31.5 16 35C19.9989 38.5 27 40 32 38C37 36 40.0001 30 40.0001 30L44 40C44 40 36 43 28.9997 44C21.9993 45 15.0001 44 8.99972 38C2.99935 32 1.99903 24.5 6.99932 18C11.1656 12.5842 17.4139 11.3337 19.3823 11.0673C19.7947 11.0114 20.2072 11 20.6234 11Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M26 23L20 11",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M18 4H32C35.866 4 39 7.13401 39 11V11",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "30",
    "cy": "16",
    "r": "2",
    "fill": props.colors[2]
  }, null)]);
});

exports.default = _default;