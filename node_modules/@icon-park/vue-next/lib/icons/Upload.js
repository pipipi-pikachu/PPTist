"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('upload', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("mask", {
    "id": props.id + '04cec2fa',
    "maskUnits": "userSpaceOnUse",
    "x": "0",
    "y": "0",
    "width": "48",
    "height": "48",
    "style": {
      maskType: 'alpha'
    }
  }, [(0, _vue.createVNode)("path", {
    "d": "M48 0H0V48H48V0Z",
    "fill": props.colors[2]
  }, null)]), (0, _vue.createVNode)("g", {
    "mask": 'url(#' + props.id + '04cec2fa' + ')'
  }, [(0, _vue.createVNode)("path", {
    "d": "M6 24.0083V42H42V24",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M33 15L24 6L15 15",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M23.9917 32V6",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)])]);
});

exports.default = _default;