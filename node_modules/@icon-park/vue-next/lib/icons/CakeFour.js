"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('cake-four', false, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M6 25L11.1711 40.6283C11.4421 41.4471 12.2074 42 13.0699 42H34.9301C35.7926 42 36.5579 41.4471 36.8289 40.6283L42 25",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M11.4071 25.1228H6.31652C6.14171 25.1228 5.99963 24.9803 6.00362 24.8055C6.16392 17.7822 11.6341 11.8858 19 10H29C36.0773 12.036 41.8233 17.9578 41.996 24.8057C42.0004 24.9804 41.8583 25.1228 41.6835 25.1228H36.5929C34.2767 25.1228 32.0393 25.9636 30.2964 27.4891C26.6917 30.6441 21.3083 30.6441 17.7036 27.4891C15.9607 25.9636 13.7233 25.1228 11.4071 25.1228Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M19.1 10C19.0344 9.67689 19 9.34247 19 9C19 6.23858 21.2386 4 24 4C26.7614 4 29 6.23858 29 9C29 9.34247 28.9656 9.67689 28.9 10",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;