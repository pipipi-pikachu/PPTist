"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('jewelry', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("circle", {
    "cx": "24",
    "cy": "24",
    "r": "20",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M20 24C20 17.6364 22.6275 15.3535 24 15C25.22 15.1768 28 17.2121 28 24C28 30.7879 25.22 33 24 33C22.6275 32.8232 20 30.3636 20 24Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M19.9995 22.9999C18.4464 21.4623 13.6179 21.8398 12.0002 21.9999C11.5149 23.7617 12.3521 27.4922 14.2934 29.4142C16.72 31.8166 18.6609 32.9999 23.9995 32.9999",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M28 22.9999C29.4358 21.4668 33.5044 21.8402 35 21.9999C35.2991 23.5969 35.1402 27.1878 32.6276 29.8707C30.115 32.5536 25.5 32.9999 24 32.9999",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth
  }, null)]);
});

exports.default = _default;