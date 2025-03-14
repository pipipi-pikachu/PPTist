"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('turn-on', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M21 43C16.2742 41.2327 12.3325 35.1851 10.3597 31.6428C9.50794 30.1134 9.95664 28.2347 11.3236 27.1411C12.8473 25.9222 15.0438 26.0438 16.4236 27.4236L18 29V17.5C18 16.1193 19.1193 15 20.5 15C21.8807 15 23 16.1193 23 17.5V23.5C23 22.1193 24.1193 21 25.5 21C26.8807 21 28 22.1193 28 23.5V25.5C28 24.1193 29.1193 23 30.5 23C31.8807 23 33 24.1193 33 25.5V27.5C33 26.1193 34.1193 25 35.5 25C36.8807 25 38 26.1193 38 27.5V35.368C38 36.4383 37.7354 37.496 37.1185 38.3707C36.0949 39.8219 34.255 42.0336 32 43C28.5 44.5 25.3701 44.6343 21 43Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M12 9L15 12",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M19 4L20 10",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M27 8L25 11",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;