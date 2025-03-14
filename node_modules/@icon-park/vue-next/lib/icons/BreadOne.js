"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('bread-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M9 26C9 26 17 14 22 7.99998C25.1307 4.24312 31 2.75 36 5C41 7.25 43 12 41 16C39 20 31 35 31 35",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M31 33.1882C31 36.3399 29.2441 39.1574 26.4861 41.0262C24.3203 42.4938 21.5366 41.867 18.5 41.867C15.2985 41.867 12.3782 42.3954 10.1667 40.7821C7.60938 38.9166 6 36.2056 6 33.1882C6 26.8125 11.5964 23 18.5 23C25.4036 23 31 27.5614 31 33.1882Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M23 33.2173C23 34.2126 22.3679 35.1023 21.375 35.6925C20.5953 36.1559 19.5932 35.958 18.5 35.958C17.3475 35.958 16.2961 36.1248 15.5 35.6154C14.5794 35.0263 14 34.1702 14 33.2173C14 31.2039 16.0147 30 18.5 30C20.9853 30 23 31.4404 23 33.2173Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M14.9998 18.0001C14.9998 18.0001 18.5 17.0001 23 18.0001",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "d": "M19.9997 10.9999C19.9997 10.9999 23.5 9.49985 26.9998 10.9999",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;