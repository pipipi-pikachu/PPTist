"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('storage-card-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 49 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M33.7778 4H15.7778V12H33.7778V4Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M15.3661 4H10.7778C9.67326 4 8.77783 4.89543 8.77783 6V42C8.77783 43.1046 9.67326 44 10.7778 44H38.7778C39.8824 44 40.7778 43.1046 40.7778 42V6C40.7778 4.89543 39.8824 4 38.7778 4H34.1896",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M27.7775 20L19.7778 28.0012H29.7818L21.7781 36.0018",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;