"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('fish-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M44 24C42.7848 28.6903 36.038 32.4667 33 32.9997C30.5696 38.9691 24.038 39.5327 21 38.9997L25 32.9997C20.5443 32.5733 15.0253 27.9544 13 26.0001C10.3861 28.8504 6.19409 31.0805 4 31.9688C7.64557 24.2939 5.51899 17.3097 4 15.0001C6.83544 15.0001 11.1435 18.2235 13 20.0001C15.0253 17.8681 21.962 14.8879 25 13.9997L21 8.99979C28.6962 8.147 32.1561 11.868 33 14C40.6962 15.7056 43.6624 21.6904 44 24Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("circle", {
    "cx": "36",
    "cy": "24.0001",
    "r": "2",
    "fill": props.colors[2]
  }, null)]);
});

exports.default = _default;