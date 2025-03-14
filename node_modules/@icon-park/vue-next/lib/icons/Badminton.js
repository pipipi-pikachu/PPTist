"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('badminton', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M19.5 44C21.99 44 24 41.99 24 39.5V19H20L15 39.5C15 41.99 17.01 44 19.5 44Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M20.0004 19H16.0004L6.68045 37.9C5.57045 40.51 7.16045 43.64 9.98045 43.97C10.1504 43.99 10.3204 44 10.5004 44C12.9904 44 15.0004 41.99 15.0004 39.5",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M28.5 44C26.01 44 24 41.99 24 39.5V19H28L33 39.5C33 41.99 30.99 44 28.5 44Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M28 19H32L41.32 37.9C42.43 40.51 40.84 43.64 38.02 43.97C37.85 43.99 37.68 44 37.5 44C35.01 44 33 41.99 33 39.5",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M16.06 13C16.02 12.67 16 12.34 16 12C16 7.58 19.58 4 24 4C28.42 4 32 7.58 32 12C32 12.34 31.98 12.67 31.94 13H16.06Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-miterlimit": "2",
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;