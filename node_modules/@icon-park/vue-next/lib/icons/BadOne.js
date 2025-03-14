"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('bad-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M35.9115 6.45609L41.2811 25.4561C41.6418 26.7325 40.6828 28 39.3564 28H27.8747C27.1714 28 26.651 28.6542 26.8091 29.3395L27.3086 31.5039C27.7668 33.4893 27.9139 35.5337 27.7446 37.5642L27.6527 38.6673C27.5541 39.8507 27.0393 40.9607 26.1996 41.8004C25.4315 42.5685 24.3898 43 23.3035 43H23.0644C22.4074 43 21.8021 42.6438 21.4831 42.0696L18.825 37.2851C17.6329 35.1392 15.8559 33.376 13.7009 32.2005L7.0423 28.5685C6.39977 28.2181 6 27.5446 6 26.8127V7C6 5.89543 6.89543 5 8 5H33.9869C34.882 5 35.6681 5.59473 35.9115 6.45609Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;