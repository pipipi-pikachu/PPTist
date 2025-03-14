"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('apple-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M24 41.0202C26.4311 41.0202 27.4311 42.3302 28.7342 42.6214C30.0373 42.9127 31.1312 42.9935 32.2515 42.4999C34.47 41.5223 35.8224 40.3578 37.4634 38.6186C40.5046 35.3953 42 30.9635 42 25.0286C42 19.0936 40.3996 16.0265 37.9334 14.0202C35.4672 12.014 34.037 11.6296 31.0549 12.014C28.0727 12.3983 26.4489 15.6025 24.0083 15.6025C21.5678 15.6025 18.5933 12.4431 16.0055 12.014C13.4177 11.5848 12 12.014 9.75967 14.0202C7.51934 16.0265 6 19.1506 6 25.0286C6 30.9066 7.55155 35.265 10.5927 38.4882C12.2337 40.2275 13.53 41.5223 15.7485 42.4999C16.8688 42.9935 18.0267 42.9127 19.2844 42.6214C20.5422 42.3302 21.5422 41.0202 24 41.0202Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M24.0088 15.6025C24.7936 7.86751 28.1278 4 34.0114 4C34.5509 5.62786 34.6902 7.20336 34.4295 8.7265C34.3056 9.45008 33.9212 10.4819 33.2764 11.8219",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), (0, _vue.createVNode)("path", {
    "d": "M14.2289 26C13.9523 27.3457 13.9523 28.7313 14.2289 30.1566C14.5054 31.5819 15.0944 32.6818 15.9957 33.4563",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});

exports.default = _default;