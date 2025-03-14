"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('clothes-skates', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M18 4H8C6.11438 4 5.17157 4 4.58579 4.58579C4 5.17157 4 6.11438 4 8V40C4 41.8856 4 42.8284 4.58579 43.4142C5.17157 44 6.11438 44 8 44H12L16 40L20 44H40C41.8856 44 42.8284 44 43.4142 43.4142C44 42.8284 44 41.8856 44 40V32.4747C44 27.4829 44 24.987 42.5202 23.2917C41.0404 21.5964 38.5674 21.2592 33.6214 20.5847L32.3786 20.4153C27.4326 19.7408 24.9596 19.4036 23.4798 17.7083C22 16.013 22 13.5171 22 8.52531V8C22 6.11438 22 5.17157 21.4142 4.58579C20.8284 4 19.8856 4 18 4Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M44 34H4",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M4 11.5H22",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "15",
    "cy": "23",
    "r": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;