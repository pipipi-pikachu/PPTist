"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('bat', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M21.6188 8.98551L22.095 11.4493H25.905L26.3812 8.98551C26.8574 10.628 27.8097 14.2087 27.8097 15.3913C29.5558 15.2271 32.9526 14.0116 32.5716 10.4638C32.5716 9.97101 32.1905 8.78841 30.6667 8C34.9524 8.98551 43.619 13.7159 44 24.7536C41.1429 22.9469 35.2381 21.6 34.4762 30.6667C32.7303 27.7101 28.6671 23.3739 26.3812 29.6812C25.5875 32.4734 23.9998 38.8464 23.9998 42C23.9998 38.8464 22.4125 32.4734 21.6188 29.6812C19.3329 23.3739 15.2697 27.7101 13.5238 30.6667C12.7619 21.6 6.85714 22.9469 4 24.7536C4.38095 13.7159 13.0476 8.98551 17.3333 8C15.8095 8.78841 15.4284 9.97101 15.4284 10.4638C15.0474 14.0116 18.4442 15.2271 20.1903 15.3913C20.1903 14.2087 21.1426 10.628 21.6188 8.98551Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;