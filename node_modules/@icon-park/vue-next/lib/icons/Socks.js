"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('socks', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M40.0001 18C37.0001 18 32.0005 18 30.0003 23C28 28 30.5002 32.5 33.0002 35",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M18 10L40 10",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M20.0005 4H38.0006C39.1052 4 40.0006 4.89543 40.0006 6V24.2876C40.0006 27.7198 38.4001 30.9554 35.6645 33.0283C32.0224 35.7881 27.0882 39.5088 25.0005 41C21.5005 43.5 15.0005 46 10.0008 41C5.00104 36 6.25114 29.443 10.001 26C13.7508 22.557 18.0005 19.1519 18.0005 19.1519V6C18.0005 4.89543 18.8959 4 20.0005 4Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;