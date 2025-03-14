"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('sperm', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("g", {
    "clip-path": 'url(#' + props.id + 'bd2908cf' + ')'
  }, [(0, _vue.createVNode)("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M18.2374 24.4746C20.0932 25.774 20.5673 27.1488 21.8458 28.0441C23.2456 29.0242 24.7931 29.5446 26.0149 29.0594C28.3219 28.1433 29.9908 25.1508 32.0264 22.2437C35.9861 16.5887 35.9796 7.85888 32.2866 5.273C28.5936 2.68713 20.4434 5.70557 16.4837 11.3606C14.5488 14.124 12.0147 17.8057 12.1672 19.3632C12.2957 20.6745 12.7366 21.405 14.1249 22.6378C15.5132 23.8706 16.2569 23.0878 18.2374 24.4746Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), (0, _vue.createVNode)("path", {
    "d": "M13.6175 22.3169C10.0769 26.2145 9.60934 29.1762 12.2147 31.2019C14.8201 33.2276 18.0918 32.2293 22.0296 28.2071",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), (0, _vue.createVNode)("path", {
    "d": "M12.2386 31.2274C9.14181 34.6146 8.57222 37.7734 10.5299 40.7039C13.4663 45.0997 19.2838 44.8594 22.124 41.5828C24.9642 38.3062 30.3082 30.1868 36.183 31.8559C42.0578 33.525 41.0605 39.9438 37.122 40.6182",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]), (0, _vue.createVNode)("defs", null, [(0, _vue.createVNode)("clipPath", {
    "id": props.id + 'bd2908cf'
  }, [(0, _vue.createVNode)("rect", {
    "width": "48",
    "height": "48",
    "fill": props.colors[2]
  }, null)])])]);
});

exports.default = _default;