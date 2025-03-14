"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('xiaodu', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M4.14317 21.0805C4.4982 17.2939 4.67571 15.4006 6.65595 13.3751C8.63619 11.3496 10.8152 11.0955 15.1734 10.5873C18.0037 10.2573 21.1305 10 24 10C26.8695 10 29.9963 10.2573 32.8266 10.5873C37.1848 11.0955 39.3638 11.3496 41.3441 13.3751C43.3243 15.4006 43.5018 17.2939 43.8568 21.0805C43.9464 22.0361 44 23.0181 44 24C44 24.9819 43.9464 25.9639 43.8568 26.9195C43.5018 30.7061 43.3243 32.5994 41.3441 34.6249C39.3638 36.6504 37.1848 36.9045 32.8266 37.4127C29.9963 37.7427 26.8695 38 24 38C21.1305 38 18.0037 37.7427 15.1734 37.4127C10.8152 36.9045 8.63619 36.6504 6.65595 34.6249C4.67571 32.5994 4.4982 30.7061 4.14317 26.9195C4.05357 25.9639 4 24.9819 4 24C4 23.0181 4.05357 22.0361 4.14317 21.0805Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M16 19V29",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M33 19L28 24L33 29",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;