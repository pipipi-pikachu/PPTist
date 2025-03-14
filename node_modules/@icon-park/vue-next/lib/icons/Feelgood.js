"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('feelgood', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M23.1421 15.8579L11.8284 27.1716C10.2663 28.7337 10.2663 31.2663 11.8284 32.8284L21.7279 42.7279C23.29 44.29 25.8227 44.29 27.3848 42.7279L37.2843 32.8284C38.8464 31.2663 38.8464 28.7337 37.2843 27.1716L25.9706 15.8579C25.1895 15.0768 23.9232 15.0768 23.1421 15.8579Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M25 13.8394C25 13.8394 29.5543 8.73027 31.3728 6.57393C33.1913 4.41758 35.1405 4.69583 36.7652 6.09795C38.3899 7.50007 38.4332 9.71417 36.7652 11.775C35.0972 13.8358 30.5565 19.0005 30.5565 19.0005",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M25 13.8389C25 13.8389 20.4457 8.72979 18.6272 6.57344C16.8087 4.4171 14.8595 4.69534 13.2348 6.09746C11.6101 7.49958 11.5668 9.71368 13.2348 11.7745C14.9028 13.8353 19.4435 19 19.4435 19",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;