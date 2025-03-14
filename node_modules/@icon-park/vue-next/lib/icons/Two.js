"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _runtime = require("../runtime");

var _default = (0, _runtime.IconWrapper)('two', true, function (props) {
  return (0, _vue.createVNode)("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [(0, _vue.createVNode)("path", {
    "d": "M11 40L6.8931 31.1017C5.81795 28.7722 6.68043 26.007 8.88925 24.7018L14.4301 21.4277C15.3946 20.8577 16.5963 20.8727 17.5463 21.4664L18.2334 21.8959C18.9449 22.3405 19.8546 21.7643 19.7566 20.9311L18.1481 7.25893C18.0546 6.46386 18.3303 5.66974 18.8963 5.10367C19.5247 4.47535 20.5249 4.41995 21.2188 4.97504L21.5966 5.27727C22.178 5.74239 22.5657 6.40711 22.6842 7.14218L24.9229 21.0222C24.9673 21.2976 25.2051 21.5 25.484 21.5C25.7767 21.5 26.0215 21.2777 26.0497 20.9864L27.3779 7.26175C27.456 6.45511 27.857 5.71437 28.4899 5.20811L28.6963 5.04293C29.4385 4.44919 30.5084 4.50844 31.1805 5.18051C31.7052 5.70522 32 6.41688 32 7.15893V29.4194C32 30.2579 32.9695 30.7244 33.6243 30.2006L37 27.5C38.6529 26.1777 40.8749 27.041 42.255 27.945C42.6936 28.2323 42.7587 28.8265 42.447 29.2482L34.5 40C34.5 40 31 44 23 44C15 44 11.6667 41.3333 11 40Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});

exports.default = _default;