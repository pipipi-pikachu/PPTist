"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('holding-hands', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M4.46094 12.8403L22.2354 9.06225C22.7543 8.95197 23.2957 9.05231 23.7405 9.3412L31.8394 14.6007C32.2843 14.8896 32.8257 14.9899 33.3445 14.8797L37.425 14.0123C38.5054 13.7827 39.5674 14.4724 39.7971 15.5528L40.4208 18.4873C40.6505 19.5677 39.9608 20.6297 38.8803 20.8594L31.8655 22.3504C31.3466 22.4607 30.8052 22.3604 30.3604 22.0715L22.2615 16.812C21.8166 16.5231 21.2752 16.4227 20.7564 16.533L17.654 17.1924",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), (0, _vue.createVNode)("path", {
    "d": "M43.5391 33.1592L25.7646 36.9373C25.2457 37.0475 24.7043 36.9472 24.2595 36.6583L16.1606 31.3988C15.7157 31.1099 15.1743 31.0096 14.6555 31.1199L10.575 31.9872C9.49461 32.2168 8.43258 31.5271 8.20292 30.4467L7.57919 27.5123C7.34954 26.4318 8.03923 25.3698 9.11966 25.1401L16.1345 23.6491C16.6534 23.5388 17.1948 23.6391 17.6396 23.928L25.7385 29.1875C26.1834 29.4764 26.7248 29.5768 27.2436 29.4665L30.346 28.8071",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});

exports.default = _default;