"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('facebook-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M4.11111 46C2.94518 46 2 45.0496 2 43.8773V4.12274C2 2.95038 2.94518 2 4.11111 2H43.8889C45.0548 2 46 2.95038 46 4.12274V43.8773C46 45.0496 45.0548 46 43.8889 46C42.4815 46 29.2222 46 4.11111 46Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), (0, _vue.createVNode)("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M38.6617 17.8869H34.3076H33.7932C32.4431 17.8869 31.3487 18.9814 31.3487 20.3314V25.2217H38.6617L37.5907 32.5525H31.3487V46H23.3067V32.5525H16.667V25.2217H23.2209L23.3067 18.2633L23.2828 15.7694C23.249 12.2477 26.0764 9.36542 29.5981 9.33159C29.6185 9.3314 29.6389 9.3313 29.6593 9.3313H38.6617V17.8869Z",
    "fill": props.colors[0]
  }, null)]);
});

exports.default = _default;