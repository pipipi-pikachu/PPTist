"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('waistline', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M13 31C16.0556 32.5092 26.2 34.6222 35 31",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "24",
    "cy": "25.4121",
    "r": "2",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M10 5C11.8558 8.27796 14.971 15.2575 15 22C15.0089 24.0646 14.6814 26.107 13.9995 28.0141C12.1815 33.0986 9.4545 36.0423 9 43",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M38 5C36.1442 8.27796 33.029 15.2575 33 22C32.9911 24.0646 33.3186 26.107 34.0005 28.0141C35.8185 33.0986 38.5455 36.0423 39 43",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M8 18C8 18 9 20 9 22C9 23.6102 8 26 8 26",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M40 18C40 18 39 20 39 22C39 23.6102 40 26 40 26",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;