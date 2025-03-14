"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('five-five', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M14.2227 37.471L6.54955 26.9844C5.13168 25.0466 5.51902 22.3315 7.42219 20.8675C9.18287 19.5132 11.675 19.675 13.2457 21.2457L16 24V7.25C16 5.45507 17.4551 4 19.25 4C21.0449 4 22.5 5.45508 22.5 7.25V6.25C22.5 4.45507 23.9551 3 25.75 3C27.5449 3 29 4.45508 29 6.25V7.25C29 5.45507 30.4551 4 32.25 4C34.0449 4 35.5 5.45508 35.5 7.25V11.25C35.5 9.45507 36.9551 8 38.75 8C40.5449 8 42 9.45507 42 11.25V30.3077C42 33.0387 41.1618 35.7251 39.6196 37.979C37.0557 41.7263 32.7851 44 28.2446 44H27.0901C22.0053 44 17.2254 41.5747 14.2227 37.471Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;