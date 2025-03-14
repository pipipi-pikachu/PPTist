"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('good-one', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M35.9115 41.5439L41.2811 22.5439C41.6418 21.2675 40.6828 20 39.3564 20H27.8747C27.1714 20 26.651 19.3458 26.8091 18.6605L27.3086 16.4961C27.7668 14.5107 27.9139 12.4663 27.7446 10.4358L27.6527 9.3327C27.5541 8.14935 27.0393 7.03925 26.1996 6.1996C25.4315 5.43151 24.3898 5 23.3035 5H23.0644C22.4074 5 21.8021 5.35616 21.4831 5.93043L18.825 10.7149C17.6329 12.8608 15.8559 14.624 13.7009 15.7995L7.0423 19.4315C6.39977 19.7819 6 20.4554 6 21.1873V41C6 42.1046 6.89543 43 8 43H33.9869C34.882 43 35.6681 42.4053 35.9115 41.5439Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;