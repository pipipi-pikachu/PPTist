"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('butterfly', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M5.0002 12.0003C8.66389 7.70613 19.0814 18.8191 24.0002 25C28.9191 18.8191 39.3366 7.70599 43.0002 12.0001C43.6787 12.6507 44.4427 14.877 42.0002 18C41.3217 18.9759 40.186 21.7059 41.0002 26C41.0002 27.1386 39.8852 28.9519 35.0002 27C37.3749 28.6266 41.8498 33.0962 39.0002 37C36.2864 40.4158 29.9649 44.4569 26.0002 35L24.0002 31L22.0002 35C18.0356 44.4569 11.7141 40.4158 9.00024 37C6.15071 33.0962 10.6255 28.6268 13.0001 27.0003C8.1152 28.9521 7.00011 27.1389 7.00011 26.0003C7.81438 21.7061 6.67867 18.9762 6.00012 18.0003C3.55766 14.8773 4.32174 12.6509 5.0002 12.0003Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24.0322 23C23.534 17.8642 28.9135 7 33 7",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M23.9678 23C24.466 17.8642 19.0865 7 15 7",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;