"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('car', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M13.5 32C14.8807 32 16 30.8807 16 29.5C16 28.1193 14.8807 27 13.5 27C12.1193 27 11 28.1193 11 29.5C11 30.8807 12.1193 32 13.5 32Z",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M34.5 32C35.8807 32 37 30.8807 37 29.5C37 28.1193 35.8807 27 34.5 27C33.1193 27 32 28.1193 32 29.5C32 30.8807 33.1193 32 34.5 32Z",
    "fill": props.colors[0]
  }, null), (0, _vue.createVNode)("path", {
    "d": "M7 37C5.34315 37 4 35.6569 4 34L4 24.7097C4 22.4363 5.28486 20.3581 7.3186 19.3422L8.00053 19.0015L10.3105 9.09194C10.7326 7.28117 12.3467 6 14.206 6L33.8943 6C35.7675 6 37.3899 7.29998 37.7981 9.12816L40.0031 19.0015L40.6834 19.3416C42.716 20.358 44 22.4355 44 24.7081V34C44 35.6569 42.6569 37 41 37H39.0031V38C39.0031 40.2091 37.2107 42 35.0016 42C32.7924 42 31 40.2091 31 38V37H17V38.0003C17 40.2093 15.2093 42 13.0003 42C10.7913 42 9.00053 40.2093 9.00053 38.0003V37H7Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M14 22H34L32.348 14.5661C32.1447 13.6511 31.3331 13 30.3957 13L17.6043 13C16.6669 13 15.8553 13.6511 15.652 14.5661L14 22Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;