"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('natural-mode', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M24.0005 27C18.3431 27 14.065 22.6575 14.065 17L14 7L19.0005 11L24.0005 5L29.0005 11L34.0005 7V17C34.0005 22.6575 29.658 27 24.0005 27Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "10",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M23.4862 43.3137C25.0483 41.7516 23.1488 37.3195 19.2436 33.4142C15.3383 29.509 10.9062 27.6095 9.34408 29.1715C7.78199 30.7336 9.68146 35.1658 13.5867 39.0711C17.492 42.9763 21.9241 44.8758 23.4862 43.3137Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "10",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24.8289 42.9706C26.391 44.5327 30.8231 42.6332 34.7283 38.7279C38.6336 34.8227 40.5331 30.3905 38.971 28.8285C37.4089 27.2664 32.9767 29.1658 29.0715 33.0711C25.1662 36.9763 23.2668 41.4085 24.8289 42.9706Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "10",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;